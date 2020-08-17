interface IMailConfig {
	driver: 'ethereal' | 'ses';

	defaults: {
		from: {
			email: string;
			name: string;
		};
	};
}

export default {
	driver: process.env.MAIL_DRIVER || 'ethereal',

	defaults: {
		from: {
			email: 'contato@badbit.com.br',
			name: 'Contato BadBit Software LTDA.',
		},
	},
} as IMailConfig;
