/* eslint-disable @typescript-eslint/no-explicit-any */

import { EntitySchema } from 'typeorm';
import { User } from './user';


const UserEntitySchame = User as unknown as EntitySchema<any>;


export = [UserEntitySchame];
