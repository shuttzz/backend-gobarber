import 'reflect-metadata';
import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';
import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import AppError from '@shared/errors/AppError';

describe('CreateAppointment', () => {
	it('should be able to create a new appointment', async () => {
		const fakeAppointmentsRepository = new FakeAppointmentsRepository();
		const createAppointment = new CreateAppointmentService(
			fakeAppointmentsRepository,
		);

		const appoitment = await createAppointment.execute({
			date: new Date(),
			providerId: '123123123',
		});

		expect(appoitment).toHaveProperty('id');
		expect(appoitment.providerId).toBe('123123123');
	});

	it('should not be able to create two appointments on the same time', async () => {
		const fakeAppointmentsRepository = new FakeAppointmentsRepository();
		const createAppointment = new CreateAppointmentService(
			fakeAppointmentsRepository,
		);

		const appoitmentDate = new Date(2020, 4, 10, 11);

		const appoitment = await createAppointment.execute({
			date: appoitmentDate,
			providerId: '123123123',
		});

		// Aqui eu testo para saber se a função que está dentro do expect irá retornar um erro
		expect(
			createAppointment.execute({
				date: appoitmentDate,
				providerId: '123123123',
			}),
		).rejects.toBeInstanceOf(AppError);
	});
});
