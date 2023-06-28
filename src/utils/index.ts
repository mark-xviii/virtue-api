import { BaseEntityExtended } from './db-entities/base.entity';
import { hashify } from './crypto/hashify';

const Utils = {
  DatabaseEntities: {
    BaseEntityExtended,
  },
  Crypto: {
    hashify,
  },
};

export default Utils;
