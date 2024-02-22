/*
 * spurtcommerce API
 * version 4.5
 * Copyright (c) 2021 piccosoft ltd
 * Author piccosoft ltd <support@piccosoft.com>
 * Licensed under the MIT license.
 */

import { EntityRepository, Repository } from 'typeorm';
import { Plugins } from '../models/Plugin';

@EntityRepository(Plugins)
export class PluginRepository extends Repository<Plugins>  {

}
