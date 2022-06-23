// eslint-disable-next-line import/no-extraneous-dependencies
import '@jimp/core';

declare module '@jimp/core' {
  export interface JimpConstructors {
    read(rawImage: {
      data: Buffer;
      width: number;
      height: number;
    }): Promise<this['prototype']>;
  }
}
