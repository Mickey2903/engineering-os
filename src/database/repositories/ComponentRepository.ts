import type { EngineeringDatabase } from "../EngineeringDatabase";
import { isComponent } from "../../models/EngineeringEntity";
import type { Component } from "../../models/Component";
import { BaseRepository } from "./BaseRepository";

export class ComponentRepository extends BaseRepository<Component> {
  public constructor(database: EngineeringDatabase) {
    super(database, isComponent);
  }

  public findByManufacturer(manufacturer: string): readonly Component[] {
    return this.findWhere((component) => component.manufacturer === manufacturer);
  }

  public findByPartNumber(partNumber: string): readonly Component[] {
    return this.findWhere((component) => component.partNumber === partNumber);
  }

  public findByLifecycle(lifecycle: Component["lifecycle"]): readonly Component[] {
    return this.findWhere((component) => component.lifecycle === lifecycle);
  }

  public findByTag(tag: string): readonly Component[] {
    return this.findWhere((component) => component.tags.includes(tag));
  }
}
