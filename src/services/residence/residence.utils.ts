import { getConnection } from 'typeorm';


const generateHash = (): string => {
  const hash = Math.random().toString(36).substr(4, 4);
  if (hash.length === 4) return hash;
  return generateHash();
};

const hashVerified = async (name: string): Promise<string> => {
  const hash = generateHash();
  const connection = getConnection();

  const query = await connection.query(`SELECT * FROM residence WHERE residence.name LIKE '${name}#${hash}' LIMIT 1`);
  if (query.length) {
    const newHash = await hashVerified(name);
    return newHash;
  }

  return hash;
};


export { hashVerified };
