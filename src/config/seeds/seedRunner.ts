import { DataSource } from 'typeorm';
import { CategorySeed } from './entities/category.seed';
import { IngredientSeed } from './entities/ingredient.seed';
import { StateSeed } from './entities/state.seed';
import { ISeed } from './ISeed';
import { ClientSeed } from './entities/client.seed';
import { TransitionTypeSeed } from './entities/transitionType.seed';

export class SeedRunner {
  constructor(private readonly datasource: DataSource) {}

  async run() {
    console.log('Running seed scripts...');
    try {
      const seeds: ISeed<unknown>[] = [
        CategorySeed.getInstance(),
        ClientSeed.getInstance(),
        IngredientSeed.getInstance(),
        StateSeed.getInstance(),
        TransitionTypeSeed.getInstance(),
      ];
      for (const seed of seeds) {
        await this.datasource
          .createQueryBuilder()
          .insert()
          .into(seed.getEntity())
          .values(seed.getData())
          .orIgnore()
          .execute();
      }
      console.log('Seed scripts executed successfully.');
    } catch (error: any) {
      console.error('Error running seed scripts:', error);
    }
  }
}
