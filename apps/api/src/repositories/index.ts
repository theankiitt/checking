import {
  categoryRepository,
  CategoryRepository,
} from "./implementations/CategoryRepository";
import {
  brandRepository,
  BrandRepository,
} from "./implementations/BrandRepository";
import {
  configurationRepository,
  ConfigurationRepository,
} from "./implementations/ConfigurationRepository";

export interface IRepositoryContainer {
  category: CategoryRepository;
  brand: BrandRepository;
  configuration: ConfigurationRepository;
}

class RepositoryContainer implements IRepositoryContainer {
  private _category!: CategoryRepository;
  private _brand!: BrandRepository;
  private _configuration!: ConfigurationRepository;

  get category(): CategoryRepository {
    return this._category;
  }

  get brand(): BrandRepository {
    return this._brand;
  }

  get configuration(): ConfigurationRepository {
    return this._configuration;
  }

  initialize(): void {
    this._category = categoryRepository;
    this._brand = brandRepository;
    this._configuration = configurationRepository;
  }
}

export const repositoryContainer = new RepositoryContainer();
export { categoryRepository, brandRepository, configurationRepository };
export {
  CategoryRepository,
  BrandRepository,
  ConfigurationRepository,
} from "./implementations";
