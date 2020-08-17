import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
import ICreateNotificationDTO from '@modules/notifications/dtos/ICreateNotificationDTO';
import Notification from '@modules/notifications/infra/typeorm/schemas/Notification';
import { ObjectID } from 'mongodb';

class FakeNotificationsRepository implements INotificationsRepository {
	private notifications: Notification[] = [];

	public async create({
		content,
		recipientId,
	}: ICreateNotificationDTO): Promise<Notification> {
		const notification = new Notification();

		Object.assign(notification, { id: new ObjectID(), content, recipientId });

		return notification;
	}
}

export default FakeNotificationsRepository;
