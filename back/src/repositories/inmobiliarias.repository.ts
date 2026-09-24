import { AppDataSource } from "../config/data-source";
import { Inmobiliaria } from "../entities/inmobiliaria";

export class InmobiliariasRepository {
    private get repo() {
        return AppDataSource.getRepository(Inmobiliaria);
    }

    // Devuelve todas las inmobiliarias
    listar(): Promise<Inmobiliaria[]> {
        return this.repo.find();
    }

    // Busca una inmobiliaria por id. Si no existe, devuelve null
    buscarPorId(id: string): Promise<Inmobiliaria | null> {
        return this.repo.findOneBy({ id });
    }

    // Crea y guarda una inmobiliaria
    async crear(datos: Partial<Inmobiliaria>): Promise<Inmobiliaria> {
        const inmobiliaria = this.repo.create(datos);

        return await this.repo.save(inmobiliaria);
    }

    // Actualiza los datos de una inmobilaria
    async actualizar(id: string, cambios: Partial<Inmobiliaria>): Promise<Inmobiliaria | undefined> {
        const inmobiliaria = await this.repo.findOneBy({ id });

        if (!inmobiliaria) {
            return undefined;
        }

        this.repo.merge(inmobiliaria, cambios);

        return await this.repo.save(inmobiliaria);
    }

    // Elimina una inmobiliaria
    async eliminar(id: string): Promise<boolean> {
        const resultado = await this.repo.delete({ id });

        return (resultado.affected ?? 0) > 0;
    }
}

export const inmobiliariasRepository = new InmobiliariasRepository();

