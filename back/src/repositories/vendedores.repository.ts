import { DataSource } from "typeorm";
import { Vendedor } from "../entities/vendedor";
import { AppDataSource } from "../config/data-source";

export class VendedoresRepository {
    private get repo() {
        return AppDataSource.getRepository(Vendedor);
    }

    buscarPorEmail(email: string): Promise<Vendedor | null> {
        return this.repo.findOne({
            where: { email },
        });
    }

    existePorEmail(email: string): Promise<boolean> {
        return this.repo.exists({
            where: { email },
        });
    }
}

export const vendedoresRepository = new VendedoresRepository();