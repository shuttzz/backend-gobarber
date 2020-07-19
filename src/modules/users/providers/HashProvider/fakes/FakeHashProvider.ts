import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider';

class FakeHashProvider implements IHashProvider {
	compareHash(payload: string, hashed: string): Promise<boolean> {
		return Promise.resolve(payload === hashed);
	}

	generateHash(payload: string): Promise<string> {
		return Promise.resolve(payload);
	}
}

export default FakeHashProvider;
