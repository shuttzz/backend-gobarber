import 'reflect-metadata';
import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';
import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import AppError from '@shared/errors/AppError';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let createAppointment: CreateAppointmentService;

describe('CreateAppointment', () => {
	beforeEach(() => {
		fakeAppointmentsRepository = new FakeAppointmentsRepository();
		createAppointment = new CreateAppointmentService(
			fakeAppointmentsRepository,
		);
	});

	it('should be able to create a new appointment', async () => {
		jest.spyOn(Date, 'now').mockImplementationOnce(() => {
			return new Date(2020, 4, 10, 12).getTime();
		});

		const appoitment = await createAppointment.execute({
			date: new Date(2020, 4, 10, 13),
			userId: '114758',
			providerId: '123123123',
		});

		expect(appoitment).toHaveProperty('id');
		expect(appoitment.providerId).toBe('123123123');
	});

	it('should not be able to create two appointments on the same time', async () => {
		jest.spyOn(Date, 'now').mockImplementationOnce(() => {
			return new Date(2020, 4, 10, 10).getTime();
		});

		const appoitmentDate = new Date(2020, 4, 10, 11);

		await createAppointment.execute({
			date: appoitmentDate,
			userId: '114758',
			providerId: '123123123',
		});

		// Aqui eu testo para saber se a função que está dentro do expect irá retornar um erro
		await expect(
			createAppointment.execute({
				date: appoitmentDate,
				userId: '114758',
				providerId: '123123123',
			}),
		).rejects.toBeInstanceOf(AppError);
	});

	it('should not be able to create an appointment on a past date', async () => {
		jest.spyOn(Date, 'now').mockImplementationOnce(() => {
			return new Date(2020, 4, 10, 12).getTime();
		});

		await expect(
			createAppointment.execute({
				date: new Date(2020, 4, 10, 11),
				userId: '114758',
				providerId: '123123123',
			}),
		).rejects.toBeInstanceOf(AppError);
	});

	it('should not be able to create an appointment with same user as provider', async () => {
		jest.spyOn(Date, 'now').mockImplementationOnce(() => {
			return new Date(2020, 4, 10, 12).getTime();
		});

		await expect(
			createAppointment.execute({
				date: new Date(2020, 4, 10, 13),
				userId: '123123123',
				providerId: '123123123',
			}),
		).rejects.toBeInstanceOf(AppError);
	});

	it('should not be able to create an appointment before 8am and after 5pm', async () => {
		jest.spyOn(Date, 'now').mockImplementationOnce(() => {
			return new Date(2020, 4, 10, 12).getTime();
		});

		await expect(
			createAppointment.execute({
				date: new Date(2020, 4, 11, 7),
				userId: 'user-id',
				providerId: 'provider-id',
			}),
		).rejects.toBeInstanceOf(AppError);

		await expect(
			createAppointment.execute({
				date: new Date(2020, 4, 11, 18),
				userId: 'user-id',
				providerId: 'provider-id',
			}),
		).rejects.toBeInstanceOf(AppError);
	});
});
