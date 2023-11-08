import crypto from 'crypto';

export async function createHash(password: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(16).toString('hex');
    crypto.pbkdf2(
      password,
      salt,
      1000,
      64,
      'sha512',
      (err, derivedKey) => {
        if (err) {
          reject(err);
          return;
        }
        resolve([salt, derivedKey.toString('hex')].join('#'));
      },
    );
  });
}

export async function validatePassword(password: string, hash: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const hashedPassword = hash.split('#')[1];
    const salt = hash.split('#')[0];

    if (salt) {
      crypto.pbkdf2(password, salt, 1000, 64, 'sha512', (err, derivedKey) => {
        if (err) {
          reject(err);
          return;
        }
        if (derivedKey.toString('hex') === hashedPassword) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    } else {
      resolve(false);
    }
  });
}
