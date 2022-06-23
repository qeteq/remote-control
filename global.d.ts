declare module '@jimp/core' {
  interface JimpConstructors {
    read(rawImage: {
      data: Buffer;
      width: number;
      height: number;
    }): Promise<this['prototype']>;
  }
}
