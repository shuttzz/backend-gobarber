import EtherealMailProvider from '@shared/container/providers/MailProvider/implementations/EtherealMailProvider';
import SESMailProvider from '@shared/container/providers/MailProvider/implementations/SESMailProvider';
import { container } from 'tsyringe';
import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';
import mailConfig from '@config/mail';

const providers = {
	ethereal: container.resolve(EtherealMailProvider),
	ses: container.resolve(SESMailProvider),
};

container.registerInstance<IMailProvider>(
	'MailProvider',
	providers[mailConfig.driver],
);
