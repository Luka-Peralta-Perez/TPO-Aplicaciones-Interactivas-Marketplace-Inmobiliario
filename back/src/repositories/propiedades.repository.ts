import { AppDataSource } from "../config/data-source";
import { Propiedad } from "../entities/propiedad";

export class PropiedadesRepository {
    private get repo() {
        return AppDataSource.getRepository(Propiedad);
    }

    // Devuelvo todas las propiedades
    listar(): Promise<Propiedad[]> {
        return this.repo.find();
    }

    // Busco una propiedad por ID. Si no existe, devuelvo null
    buscarPorId(id: string): Promise<Propiedad | null> {
        return this.repo.findOneBy({ id });
    }

    // Creo y guardo una nueva propiedad
    async crear(datos: Partial<Propiedad>): Promise<Propiedad> {
        const propiedad = this.repo.create(datos);

        return await this.repo.save(propiedad);
    }

    // Actualizo una propiedad. Si no existe, devuelve undefined
    async actualizar(id: string, cambios: Partial<Propiedad>): Promise<Propiedad | undefined> {
        const propiedad = await this.repo.findOneBy({ id });

        if (!propiedad) {
            return undefined;
        }

        this.repo.merge(propiedad, cambios);

        return await this.repo.save(propiedad);
    }

    // Elimino una propiedad. Devuelve true si se eliminó correctamente
    async eliminar(id: string): Promise<boolean> {
        const resultado = await this.repo.delete({ id });

        return (resultado.affected ?? 0) > 0;
    }
}

export const propiedadesRepository = new PropiedadesRepository();