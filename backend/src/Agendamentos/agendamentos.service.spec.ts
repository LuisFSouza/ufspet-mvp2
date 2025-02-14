import { Test } from '@nestjs/testing';
import { PrismaService } from '../Prisma/prisma.service';
import { HttpException, HttpStatus } from '@nestjs/common';
import { AgendamentosService } from './agendamentos.service';
import { FormasPagamento } from "@prisma/client"
import { Status } from "@prisma/client"
import Decimal from 'decimal.js';
import { ClientesService } from '../Clientes/clientes.service';
import { ServicosService } from '../Servicos/servicos.service';

const fakeAgendamentosByClient = [
    {
        cod: 1,
        cliente_id: 1,
        servico_id: 1,
        data: new Date('2023-01-03 12:00:00'),
        status: 'CANCELADO' as Status,
        formaPgto: 'DEBITO' as FormasPagamento,
        servico:  {
            cod: 1,
            nome: 'Nome 1',
            duracao: 30,
            preco: new Decimal(12.99),
            descricao: 'Descrição 1',
        }
    },
    {
        cod: 2,
        cliente_id: 1,
        servico_id: 2,
        data: new Date('2024-03-05 13:50:00'),
        status: 'CONCLUIDO' as Status,
        formaPgto: 'CREDITO' as FormasPagamento,
        servico: {
            cod: 2,
            nome: 'Nome 2',
            duracao: 50,
            preco: new Decimal(53.65),
            descricao: 'Descrição 2',
        } 
    },
    {
        cod: 3,
        cliente_id: 1,
        servico_id: 3,
        data: new Date('2025-01-01 05:30:30'),
        status: 'PENDENTE' as Status,
        formaPgto: 'PIX' as FormasPagamento,
        servico: {
            cod: 3,
            nome: 'Nome 3',
            duracao: 25,
            preco: new Decimal(5.00),
            descricao: 'Descrição 3'
        } 
    }

]

const fakeAgendamentosSelect = [
    {
        cod: 1,
        cliente_id: 1,
        servico_id: 1,
        data: new Date('2023-01-03 12:00:00'),
        status: 'CANCELADO' as Status,
        formaPgto: 'DEBITO' as FormasPagamento ,
        cliente: {
            cod: 1,
            nome: 'Cliente 1',
            cpf: '12345678909',
            email: 'cliente1@gmail.com',
            telefone: '19123456789',
            endereco: 'Rua cliente 1',
        },
        servico:  {
            cod: 1,
            nome: 'Nome 1',
            duracao: 30,
            preco: new Decimal(12.99),
            descricao: 'Descrição 1',
        }
    },
    {
        cod: 2,
        cliente_id: 2,
        servico_id: 2,
        data: new Date('2024-03-05 13:50:00'),
        status: 'CONCLUIDO' as Status,
        formaPgto: 'CREDITO' as FormasPagamento,
        cliente: {
            cod: 2,
            nome: 'Cliente 2',
            cpf: '99999999999',
            email: 'cliente2@gmail.com',
            telefone: '19999999999',
            endereco: 'Rua cliente 2',
        },
        servico: {
            cod: 2,
            nome: 'Nome 2',
            duracao: 50,
            preco: new Decimal(53.65),
            descricao: 'Descrição 2',
        } 
    },
    {
        cod: 3,
        cliente_id: 3,
        servico_id: 3,
        data: new Date('2025-01-01 05:30:30'),
        status: 'PENDENTE' as Status,
        formaPgto: 'PIX' as FormasPagamento ,
        cliente: {
            cod: 3,
            nome: 'Cliente 3',
            cpf: '90987654321',
            email: 'cliente3@gmail.com',
            telefone: '19123456789',
            endereco: 'Rua cliente 3',
        },
        servico: {
            cod: 3,
            nome: 'Nome 3',
            duracao: 25,
            preco: new Decimal(5.00),
            descricao: 'Descrição 3'
        } 
    }

]

const fakeAgendamentoCreateUpdate = {
    cliente_id: 1,
    servico_id: 1,
    data: new Date('2023-01-03 12:00:00'),
    status: 'CANCELADO' as Status,
    formaPgto: 'DEBITO'as FormasPagamento,
}

const fakeAgendamentos = [
    {
        cod: 1,
        cliente_id: 1,
        servico_id: 1,
        data: new Date('2023-01-03 12:00:00'),
        status: 'CANCELADO' as Status,
        formaPgto: 'DEBITO'as FormasPagamento,
    },
    {
        cod: 2,
        cliente_id: 2,
        servico_id: 2,
        data: new Date('2024-03-05 13:50:00'),
        status: 'CONCLUIDO' as Status,
        formaPgto: 'CREDITO' as FormasPagamento,
    },
    {
        cod: 3,
        cliente_id: 3,
        servico_id: 3,
        data: new Date('2025-01-01 05:30:30'),
        status: 'PENDENTE' as Status,
        formaPgto: 'PIX' as FormasPagamento,
    }
]

const prismaMock = {
    $transaction: jest.fn(async (callback) => callback(prismaMock)),
    agendamentos: {
        create: jest.fn().mockImplementation(() => Promise.resolve(fakeAgendamentos[0])),
        findMany: jest.fn().mockImplementation(() => Promise.resolve(fakeAgendamentosSelect)),
        findUnique: jest.fn().mockImplementation(() => Promise.resolve(fakeAgendamentosSelect[0])),
        update: jest.fn().mockImplementation(() => Promise.resolve(fakeAgendamentos[0])),
        delete: jest.fn().mockImplementation(() => Promise.resolve(fakeAgendamentos[0]))
    }
}

const clienteMock = {
    readClient: jest.fn().mockImplementation(() => Promise.resolve({
        cod: 1,
        nome: 'Cliente 1',
        cpf: '12345678909',
        email: 'cliente1@gmail.com',
        telefone: '19123456789',
        endereco: 'Rua cliente 1',
    }))
}

const servicoMock = {
    readService: jest.fn().mockImplementation(() => Promise.resolve({
        cod: 1,
        nome: 'Nome 1',
        duracao: 30,
        preco: new Decimal(12.99),
        descricao: 'Descrição 1',
    }))
}

describe('Serviço de Agendamentos', () => {
    let service: AgendamentosService;
    let prisma: PrismaService;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                AgendamentosService,
                ClientesService,
                ServicosService,
                {provide: ServicosService, useValue: servicoMock},
                {provide: ClientesService, useValue: clienteMock},
                {provide: PrismaService, useValue: prismaMock},
                {
                    provide: 'forwardRef(() => ClientesService)',
                    useExisting:  ClientesService
                }
            ]
        }).compile()

        service = module.get<AgendamentosService>(AgendamentosService)
        prisma = module.get<PrismaService>(PrismaService)
    }),
    afterEach(()=>{
        jest.clearAllMocks()
    })

    it('Retorna os agendamentos', async()=>{
        const resposta = await service.readAppointments();
        expect(resposta).toEqual(fakeAgendamentosSelect);
        expect(prisma.agendamentos.findMany).toHaveBeenCalledTimes(1);
        expect(prisma.agendamentos.findMany).toHaveBeenCalledWith({
            include: {
                cliente: true,
                servico: true
            }
        });
    })

    it('Criar um agendamento', async()=>{
        const resposta = await service.createAppointment(fakeAgendamentoCreateUpdate);
        expect(resposta).toEqual(fakeAgendamentos[0]);
        expect(clienteMock.readClient).toHaveBeenCalledTimes(1);
        expect(clienteMock.readClient).toHaveBeenCalledWith(1, expect.objectContaining({
            $transaction: expect.any(Function)
        }));
        expect(servicoMock.readService).toHaveBeenCalledTimes(1);
        expect(servicoMock.readService).toHaveBeenCalledWith(1, expect.objectContaining({
            $transaction: expect.any(Function)
        }));
        expect(prisma.agendamentos.create).toHaveBeenCalledTimes(1);
        expect(prisma.agendamentos.create).toHaveBeenCalledWith({
            data: fakeAgendamentoCreateUpdate
        });
    })

    it('Criar um agendamento (com cliente, serviço e data repetidos)', async()=>{
            prismaMock.agendamentos.create.mockRejectedValueOnce({
                code: 'P2002',
                meta: {
                    target:['cliente_id', 'servico_id', 'data']
                }
            })
            await expect(service.createAppointment(fakeAgendamentoCreateUpdate)).rejects.toThrow(new HttpException('Já existe um agendamento deste serviço nesta data para este cliente', 409))
            expect(clienteMock.readClient).toHaveBeenCalledTimes(1);
            expect(clienteMock.readClient).toHaveBeenCalledWith(1, expect.objectContaining({
                $transaction: expect.any(Function)
            }));
            expect(servicoMock.readService).toHaveBeenCalledTimes(1);
            expect(servicoMock.readService).toHaveBeenCalledWith(1, expect.objectContaining({
                $transaction: expect.any(Function)
            }));
            expect(prisma.agendamentos.create).toHaveBeenCalledTimes(1);
            expect(prisma.agendamentos.create).toHaveBeenCalledWith({
                data: fakeAgendamentoCreateUpdate
            });
    })

    it('Retorna um agendamento específico', async()=>{
        const resposta = await service.readAppointment(1);
        expect(resposta).toEqual(fakeAgendamentosSelect[0]);
        expect(prisma.agendamentos.findUnique).toHaveBeenCalledTimes(1);
        expect(prisma.agendamentos.findUnique).toHaveBeenCalledWith({
            where: {cod: 1},
            include: {
                cliente: true,
                servico: true
            }
        });
    })

    it('Retorna um agendamento específico (não existente)', async()=>{
        prismaMock.agendamentos.findUnique.mockImplementationOnce(() => Promise.resolve(null))
        await expect(service.readAppointment(10)).rejects.toThrow(new HttpException('O agendamento não foi encontrado', 404))
        expect(prisma.agendamentos.findUnique).toHaveBeenCalledTimes(1);
        expect(prisma.agendamentos.findUnique).toHaveBeenCalledWith({
            where: {cod: 10},
            include: {
                cliente: true,
                servico: true
            }
        });
        
    })

    it('Atualiza um agendamento específico', async()=>{
        const readAppointmentSpy = jest.spyOn(service, 'readAppointment').mockImplementationOnce(() => Promise.resolve(fakeAgendamentosSelect[0]))
        const resposta = await service.updateAppointment(1, fakeAgendamentoCreateUpdate);
        expect(resposta).toEqual(fakeAgendamentos[0]);
        expect(readAppointmentSpy).toHaveBeenCalledTimes(1);
        expect(readAppointmentSpy).toHaveBeenCalledWith(1, expect.objectContaining({
            $transaction: expect.any(Function)
        }));
        expect(prisma.agendamentos.update).toHaveBeenCalledTimes(1);
        expect(prisma.agendamentos.update).toHaveBeenCalledWith({
            where: {cod: 1},
            data: fakeAgendamentoCreateUpdate
        });
        expect(clienteMock.readClient).toHaveBeenCalledTimes(1);
        expect(clienteMock.readClient).toHaveBeenCalledWith(1, expect.objectContaining({
            $transaction: expect.any(Function)
        }));
        expect(servicoMock.readService).toHaveBeenCalledTimes(1);
        expect(servicoMock.readService).toHaveBeenCalledWith(1, expect.objectContaining({
            $transaction: expect.any(Function)
        }));
    })

    it('Atualiza um agendamento específico (não existente)', async()=>{
        const readAppointmentSpy = jest.spyOn(service, 'readAppointment').mockRejectedValueOnce(
            new HttpException('O agendamento não foi encontrado', HttpStatus.NOT_FOUND)
        )
        prismaMock.agendamentos.findUnique.mockResolvedValueOnce(null)
        await expect(service.updateAppointment(10, fakeAgendamentoCreateUpdate)).rejects.toThrow(new HttpException('O agendamento não foi encontrado', 404))
        expect(readAppointmentSpy).toHaveBeenCalledTimes(1);
        expect(readAppointmentSpy).toHaveBeenCalledWith(10, expect.objectContaining({
            $transaction: expect.any(Function)
        }));
        expect(clienteMock.readClient).toHaveBeenCalledTimes(1);
        expect(clienteMock.readClient).toHaveBeenCalledWith(1, expect.objectContaining({
            $transaction: expect.any(Function)
        }));
        expect(servicoMock.readService).toHaveBeenCalledTimes(1);
        expect(servicoMock.readService).toHaveBeenCalledWith(1, expect.objectContaining({
            $transaction: expect.any(Function)
        }));
        expect(prisma.agendamentos.update).toHaveBeenCalledTimes(0);
        
    })

    it('Atualiza um agendamento (com cliente, serviço e data repetidos)', async()=>{
        prismaMock.agendamentos.update.mockRejectedValueOnce({
            code: 'P2002',
            meta: {
                target:['cliente_id', 'servico_id', 'data']
            }
        })
        const readAppointmentSpy = jest.spyOn(service, 'readAppointment').mockImplementationOnce(() => Promise.resolve(fakeAgendamentosSelect[0]))
        await expect(service.updateAppointment(1, fakeAgendamentoCreateUpdate)).rejects.toThrow(new HttpException('Já existe um agendamento deste serviço nesta data para este cliente', 409))
        expect(readAppointmentSpy).toHaveBeenCalledTimes(1);
        expect(readAppointmentSpy).toHaveBeenCalledWith(1, expect.objectContaining({
            $transaction: expect.any(Function)
        }));
        expect(prisma.agendamentos.update).toHaveBeenCalledTimes(1);
        expect(prisma.agendamentos.update).toHaveBeenCalledWith({
            where: {cod: 1},
            data: fakeAgendamentoCreateUpdate
        });
        expect(clienteMock.readClient).toHaveBeenCalledTimes(1);
        expect(clienteMock.readClient).toHaveBeenCalledWith(1, expect.objectContaining({
            $transaction: expect.any(Function)
        }));
        expect(servicoMock.readService).toHaveBeenCalledTimes(1);
        expect(servicoMock.readService).toHaveBeenCalledWith(1, expect.objectContaining({
            $transaction: expect.any(Function)
        }));
    })

    it('Deleta um agendamento específico', async()=>{
        const readAppointmentSpy = jest.spyOn(service, 'readAppointment').mockImplementationOnce(() => Promise.resolve(fakeAgendamentosSelect[0]))
        const resposta = await service.deleteAppointment(1);
        expect(resposta).toEqual(fakeAgendamentos[0]);
        expect(readAppointmentSpy).toHaveBeenCalledTimes(1);
        expect(readAppointmentSpy).toHaveBeenCalledWith(1, expect.objectContaining({
            $transaction: expect.any(Function)
        }));
        expect(prisma.agendamentos.delete).toHaveBeenCalledTimes(1);
        expect(prisma.agendamentos.delete).toHaveBeenCalledWith({
            where: {cod: 1}
        });
    })

    it('Deleta um agendamento específico (não existente)', async()=>{
        const readAppointmentSpy = jest.spyOn(service, 'readAppointment').mockRejectedValueOnce(
            new HttpException('O agendamento não foi encontrado', HttpStatus.NOT_FOUND)
        )
        prismaMock.agendamentos.findUnique.mockImplementationOnce(() => Promise.resolve(null))
        await expect(service.deleteAppointment(10)).rejects.toThrow(new HttpException('O agendamento não foi encontrado', 404))
        expect(readAppointmentSpy).toHaveBeenCalledTimes(1);
        expect(readAppointmentSpy).toHaveBeenCalledWith(10, expect.objectContaining({
            $transaction: expect.any(Function)
        }));
        expect(prisma.agendamentos.delete).toHaveBeenCalledTimes(0);
    })

    it('Retorna os agendamentos por cliente', async()=>{
        prismaMock.agendamentos.findMany.mockImplementationOnce(() => Promise.resolve(fakeAgendamentosByClient))
        const resposta = await service.readAppointmentByClient(1);
        expect(resposta).toEqual(fakeAgendamentosByClient);
        expect(prisma.agendamentos.findMany).toHaveBeenCalledTimes(1);
        expect(prisma.agendamentos.findMany).toHaveBeenCalledWith({
            where: {
                cliente_id: 1
            },
            include: {
                servico: true
            }
        });
    })

    it('Criar um agendamento (com serviço inexistente)', async()=>{
        servicoMock.readService.mockRejectedValueOnce(
            new HttpException('O serviço não foi encontrado', HttpStatus.NOT_FOUND)
        )
        const readAppointmentSpy = jest.spyOn(service, 'readAppointment')
        
        await expect(service.createAppointment(fakeAgendamentoCreateUpdate)).rejects.toThrow(new HttpException('O serviço não foi encontrado', 404))
        expect(clienteMock.readClient).toHaveBeenCalledTimes(1);
        expect(clienteMock.readClient).toHaveBeenCalledWith(1, expect.objectContaining({
            $transaction: expect.any(Function)
        }));
        expect(servicoMock.readService).toHaveBeenCalledTimes(1);
        expect(servicoMock.readService).toHaveBeenCalledWith(1, expect.objectContaining({
            $transaction: expect.any(Function)
        }));
        expect(readAppointmentSpy).toHaveBeenCalledTimes(0);
        expect(prisma.agendamentos.create).toHaveBeenCalledTimes(0);
    })

    it('Criar um agendamento (com cliente inexistente)', async()=>{
        clienteMock.readClient.mockRejectedValueOnce(
            new HttpException('O cliente não foi encontrado', HttpStatus.NOT_FOUND)
        )
        const readAppointmentSpy = jest.spyOn(service, 'readAppointment')
        await expect(service.createAppointment(fakeAgendamentoCreateUpdate)).rejects.toThrow(new HttpException('O cliente não foi encontrado', 404))
        expect(clienteMock.readClient).toHaveBeenCalledTimes(1);
        expect(clienteMock.readClient).toHaveBeenCalledWith(1, expect.objectContaining({
            $transaction: expect.any(Function)
        }));
        expect(servicoMock.readService).toHaveBeenCalledTimes(0);
        expect(readAppointmentSpy).toHaveBeenCalledTimes(0);
        expect(prisma.agendamentos.create).toHaveBeenCalledTimes(0);
    })

    it('Atualiza um agendamento específico (com cliente inexistente)', async()=>{
        clienteMock.readClient.mockRejectedValueOnce(
            new HttpException('O cliente não foi encontrado', HttpStatus.NOT_FOUND)
        )
        const readAppointmentSpy = jest.spyOn(service, 'readAppointment')
        await expect(service.updateAppointment(1, fakeAgendamentoCreateUpdate)).rejects.toThrow(new HttpException('O cliente não foi encontrado', 404))
    
        expect(readAppointmentSpy).toHaveBeenCalledTimes(0);
        expect(prisma.agendamentos.update).toHaveBeenCalledTimes(0);
        expect(clienteMock.readClient).toHaveBeenCalledTimes(1);
        expect(clienteMock.readClient).toHaveBeenCalledWith(1, expect.objectContaining({
            $transaction: expect.any(Function)
        }));
        expect(servicoMock.readService).toHaveBeenCalledTimes(0);
    })

    it('Atualiza um agendamento específico (com serviço inexistente)', async()=>{
        servicoMock.readService.mockRejectedValueOnce(
            new HttpException('O serviço não foi encontrado', HttpStatus.NOT_FOUND)
        )
        const readAppointmentSpy = jest.spyOn(service, 'readAppointment')
        await expect(service.updateAppointment(1, fakeAgendamentoCreateUpdate)).rejects.toThrow(new HttpException('O serviço não foi encontrado', 404))
    
        expect(readAppointmentSpy).toHaveBeenCalledTimes(0);
        expect(prisma.agendamentos.update).toHaveBeenCalledTimes(0);
        expect(servicoMock.readService ).toHaveBeenCalledTimes(1);
        expect(servicoMock.readService).toHaveBeenCalledWith(1, expect.objectContaining({
            $transaction: expect.any(Function)
        }));
        expect(clienteMock.readClient).toHaveBeenCalledTimes(1);
        expect(clienteMock.readClient).toHaveBeenCalledWith(1, expect.objectContaining({
            $transaction: expect.any(Function)
        }));
    })
    
})
/*https://dev.to/mrtinsvitor/testes-com-nestjs-e-prisma-24bo*/


