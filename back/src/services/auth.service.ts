import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../config/data-source";
import { Vendedor } from "../entities/vendedor";
import { Inmobiliaria } from "../entities/inmobiliaria";
import { RegistrarVendedorDto } from "../controllers/auth.dto";
import { LoginVendedorDto } from "../controllers/auth.dto";
import { vendedoresRepository } from "../repositories/vendedores.repository";
import { inmobiliariasRepository } from "../repositories/inmobiliarias.repository";
import { ConflictError } from "../errors/inmobiliaria.errors";
import { UnauthorizedError } from "../errors/auth.errors";


export const authService = {
    async registrar(dto: RegistrarVendedorDto) {
        const emailExiste = await vendedoresRepository.existePorEmail(dto.email);

        if (emailExiste) {
            throw new ConflictError("Ya existe un vendedor con ese email");
        }

        const nombreExiste = await inmobiliariasRepository.existePorNombre(dto.nombreInmobiliaria);

        if (nombreExiste) {
            throw new ConflictError("Ya existe una inmobiliaria con ese nombre");
        }

        const hashContrasenia = await bcrypt.hash(dto.contrasenia, 10);

        // La transacción asegura que vendedor e inmobiliaria se creen juntos o que no se guarde ninguno si hay un error
        return AppDataSource.transaction(async (manager) => {
            const vendedorRepository = manager.getRepository(Vendedor);
            const inmobiliariaRepository = manager.getRepository(Inmobiliaria);

            const vendedor = vendedorRepository.create({
                nombreCompleto: dto.nombreCompleto,
                email: dto.email,
                hashContrasenia,
                telefono: dto.telefono,
            });

            await vendedorRepository.save(vendedor);

            const inmobiliaria = inmobiliariaRepository.create({
                nombre: dto.nombreInmobiliaria,
                descripcion: dto.descripcion,
                logoUrl: dto.logoUrl,
                telefonoContacto: dto.telefonoContacto,
                emailContacto: dto.emailContacto,
                direccionOficina: dto.direccionOficina,
                vendedor,
            });

            await inmobiliariaRepository.save(inmobiliaria);

            return {
                vendedor: {
                    id: vendedor.id,
                    nombreCompleto: vendedor.nombreCompleto,
                    email: vendedor.email,
                    telefono: vendedor.telefono,
                },
                inmobiliaria: {
                    id: inmobiliaria.id,
                    nombre: inmobiliaria.nombre,
                },
            };
        });
    },

    async login(dto: LoginVendedorDto) {
        const vendedor = await vendedoresRepository.buscarPorEmail(dto.email);

        if(!vendedor) {
            throw new UnauthorizedError("Credenciales inválidas");
        }

        // Compara la contraseña ingresada con el hash guardado en la base de datos
        const contraseniaValida = await bcrypt.compare(dto.contrasenia, vendedor.hashContrasenia);

        if(!contraseniaValida) {
            throw new UnauthorizedError("Credenciales inválidas");
        }

        const jwtSecret = process.env.JWT_SECRET;

        if(!jwtSecret) {
            throw new Error("JWT_SECRET no está configurado");
        }

        const token = jwt.sign({ vendedorId: vendedor.id },
            jwtSecret,
            { expiresIn: "2h" }
        );
        return { token };
    },

};