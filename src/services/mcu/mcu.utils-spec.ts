import faker from 'faker';


interface McuFactory {
  name: string;
  mac: string;
}

interface McuOptions {
  name?: string;
  mac?: string;
}


export const McuFactory = (options?: McuOptions): McuFactory => {
  if (options) {
    return {
      name: options.name || faker.name.title(),
      mac: options.mac || Math.random().toString().substring(3),
    };
  }
  return {
    name: faker.name.title(),
    mac: Math.random().toString().substring(3),
  };
};
