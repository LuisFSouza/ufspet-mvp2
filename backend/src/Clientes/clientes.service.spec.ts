import { Test } from '@nestjs/testing';
import { PrismaService } from '../Prisma/prisma.service';
import { HttpException, HttpStatus } from '@nestjs/common';
import { ClientesService } from './clientes.service';
import { FormasPagamento, Status } from '@prisma/client';
import Decimal from 'decimal.js';
import { AgendamentosService } from '../Agendamentos/agendamentos.service';
import { VendasService } from '../Vendas/vendas.service';

const fakeClientCreateUpdate ={
    nome: 'Cliente 1',
    cpf: '12345678909',
    email: 'cliente1@gmail.com',
    telefone: '19123456789',
    endereco: 'Rua cliente 1'
}


const fakeClients = [
    {
        cod: 1,
        nome: 'Cliente 1',
        cpf: '12345678909',
        email: 'cliente1@gmail.com',
        telefone: '19123456789',
        endereco: 'Rua cliente 1',
    },
    {
        cod: 2,
        nome: 'Cliente 2',
        cpf: '99999999999',
        email: 'cliente2@gmail.com',
        telefone: '19999999999',
        endereco: 'Rua cliente 2',
    },
    {
        cod: 3,
        nome: 'Cliente 3',
        cpf: '90987654321',
        email: 'cliente3@gmail.com',
        telefone: '19123456789',
        endereco: 'Rua cliente 3',
    },
]

const prismaMock = {
    $transaction: jest.fn(async (callback) => callback(prismaMock)),
    clientes: {
        create: jest.fn().mockImplementation(() => Promise.resolve(fakeClients[0])),
        findMany: jest.fn().mockImplementation(() => Promise.resolve(fakeClients)),
        findUnique: jest.fn().mockImplementation(() => Promise.resolve(fakeClients[0])),
        update: jest.fn().mockImplementation(() => Promise.resolve(fakeClients[0])),
        delete: jest.fn().mockImplementation(() => Promise.resolve(fakeClients[0]))
    }
}

const vendasMock = {
    readSaleByClient: jest.fn().mockImplementation(() => Promise.resolve([
        { cod: 1,
            cliente_id: 1,
            data: new Date('2023-01-03 12:00:00'),
            formaPgto: 'DEBITO' as FormasPagamento ,
            totalVenda: 7.50,
            itens: [
                {
                    cod: 1,
                    venda_id: 1,
                    produto_id: 1,
                    quantidade: 3,
                    total: new Decimal(7.50)
                }
            ]
            },
            {
                cod: 2,
                cliente_id: 1,
                data: new Date('2024-03-05 13:50:00'),
                formaPgto: 'CREDITO' as FormasPagamento,
                totalVenda: 30.50,
                itens: [
                    {
                        cod: 2,
                        venda_id: 2,
                        produto_id: 1,
                        quantidade: 5,
                        total: new Decimal(10.50)
                    },
                    {
                        cod: 3,
                        venda_id: 2,
                        produto_id: 2,
                        quantidade: 6,
                        total: new Decimal(20.00)
                    }
                ]
            },
            {
                cod: 3,
                cliente_id: 1,
                data: new Date('2025-01-01 05:30:30'),
                formaPgto: 'PIX' as FormasPagamento ,
                totalVenda: 240.00,
                itens: [
                    {
                        cod: 4,
                        venda_id: 3,
                        produto_id: 1,
                        quantidade: 10,
                        total: new Decimal(21.00)
                    },
                    {
                        cod: 5,
                        venda_id: 3,
                        produto_id: 2,
                        quantidade: 20,
                        total: new Decimal(200.00)
                    },
                    {
                        cod: 6,
                        venda_id: 3,
                        produto_id: 3,
                        quantidade: 3,
                        total: new Decimal(19.00)
                    }
                ]
            }
    ]))
}

const agendamentosMock = {
    readAppointmentByClient: jest.fn().mockImplementation(() => Promise.resolve([
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
    ]))
}

describe('Serviço de Clientes', () => {
    let service: ClientesService;
    let prisma: PrismaService;
    let agendamentoService;
    let vendaService;


    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                ClientesService,
                AgendamentosService,
                VendasService,
                {provide: VendasService, useValue: vendasMock},
                {provide: AgendamentosService, useValue: agendamentosMock},
                {provide: PrismaService, useValue: prismaMock},
                {
                    provide: 'forwardRef(() => AgendamentosService)',
                    useExisting:  AgendamentosService
                },
                {
                    provide: 'forwardRef(() => VendasService)',
                    useExisting:  VendasService
                }
            ]
        }).compile()
        agendamentoService = module.get<AgendamentosService>(AgendamentosService)
        vendaService = module.get<VendasService>(VendasService)
        service = module.get<ClientesService>(ClientesService)
        prisma = module.get<PrismaService>(PrismaService)
    }),
    afterEach(()=>{
        jest.clearAllMocks()
    })

    it('Retorna os clientes', async()=>{
        const resposta = await service.readClients();
        expect(resposta).toEqual(fakeClients);
        expect(prisma.clientes.findMany).toHaveBeenCalledTimes(1);
        expect(prisma.clientes.findMany).toHaveBeenCalledWith();
    })

    it('Criar um cliente', async()=>{
        const resposta = await service.createClient(fakeClientCreateUpdate);
        expect(resposta).toEqual(fakeClients[0]);
        expect(prisma.clientes.create).toHaveBeenCalledTimes(1);
        expect(prisma.clientes.create).toHaveBeenCalledWith({
            data: fakeClientCreateUpdate
        });
    })

    it('Criar um cliente (com CPF repetido)', async()=>{
            prismaMock.clientes.create.mockRejectedValueOnce({
                code: 'P2002',
                meta: {
                    target:['cpf']
                }
            })
            await expect(service.createClient(fakeClientCreateUpdate)).rejects.toThrow(new HttpException('Já existe um cliente com este CPF', 409))
            expect(prisma.clientes.create).toHaveBeenCalledTimes(1);
            expect(prisma.clientes.create).toHaveBeenCalledWith({
                data: fakeClientCreateUpdate
            });
    })

    it('Criar um cliente (com Email repetido)', async()=>{
        prismaMock.clientes.create.mockRejectedValueOnce({
            code: 'P2002',
            meta: {
                target:['email']
            }
        })
        await expect(service.createClient(fakeClientCreateUpdate)).rejects.toThrow(new HttpException('Já existe um cliente com este email', 409))
        expect(prisma.clientes.create).toHaveBeenCalledTimes(1);
        expect(prisma.clientes.create).toHaveBeenCalledWith({
            data: fakeClientCreateUpdate
        });
    })

    it('Retorna um cliente específico', async()=>{
        const resposta = await service.readClient(1);
        expect(resposta).toEqual(fakeClients[0]);
        expect(prisma.clientes.findUnique).toHaveBeenCalledTimes(1);
        expect(prisma.clientes.findUnique).toHaveBeenCalledWith({
            where: {cod: 1}
        });
    })

    it('Retorna um cliente específico (não existente)', async()=>{
        prismaMock.clientes.findUnique.mockImplementationOnce(() => Promise.resolve(null))
        await expect(service.readClient(10)).rejects.toThrow(new HttpException('O cliente não foi encontrado', 404))
        expect(prisma.clientes.findUnique).toHaveBeenCalledTimes(1);
        expect(prisma.clientes.findUnique).toHaveBeenCalledWith({
            where: {cod: 10}
        });
    })

    it('Atualiza um cliente específico', async()=>{
        const readClientSpy = jest.spyOn(service, 'readClient').mockImplementationOnce(() => Promise.resolve(fakeClients[0]))
        const resposta = await service.updateClient(1, fakeClientCreateUpdate);
        expect(resposta).toEqual(fakeClients[0]);
        expect(readClientSpy).toHaveBeenCalledTimes(1);
        expect(readClientSpy).toHaveBeenCalledWith(1, expect.objectContaining({
            $transaction: expect.any(Function)
        }));
        expect(prisma.clientes.update).toHaveBeenCalledTimes(1);
        expect(prisma.clientes.update).toHaveBeenCalledWith({
            where: {cod: 1},
            data: fakeClientCreateUpdate
        });
    })

    it('Atualiza um cliente específico (não existente)', async()=>{

        const readClientSpy = jest.spyOn(service, 'readClient').mockRejectedValueOnce(
            new HttpException('O cliente não foi encontrado', HttpStatus.NOT_FOUND)
        )
        await expect(service.updateClient(10, fakeClientCreateUpdate)).rejects.toThrow(new HttpException('O cliente não foi encontrado', 404))
        expect(readClientSpy).toHaveBeenCalledTimes(1);
        expect(readClientSpy).toHaveBeenCalledWith(10, expect.objectContaining({
            $transaction: expect.any(Function)
        }));
        expect(prisma.clientes.update).toHaveBeenCalledTimes(0);
    })

    it('Atualiza um cliente (com CPF repetido)', async()=>{
            prismaMock.clientes.update.mockRejectedValueOnce({
                code: 'P2002',
                meta: {
                    target:['cpf']
                }
            })
            const readClientSpy = jest.spyOn(service, 'readClient').mockImplementationOnce(() => Promise.resolve(fakeClients[0]))
            await expect(service.updateClient(1, fakeClientCreateUpdate)).rejects.toThrow(new HttpException('Já existe um cliente com este CPF', 409))
            expect(readClientSpy).toHaveBeenCalledTimes(1);
            expect(readClientSpy).toHaveBeenCalledWith(1, expect.objectContaining({
                $transaction: expect.any(Function)
            }));
            expect(prisma.clientes.update).toHaveBeenCalledTimes(1);
            expect(prisma.clientes.update).toHaveBeenCalledWith({
                where: {cod: 1},
                data: fakeClientCreateUpdate
            });
    })

    it('Atualiza um cliente (com Email repetido)', async()=>{
        prismaMock.clientes.update.mockRejectedValueOnce({
            code: 'P2002',
            meta: {
                target:['email']
            }
        })
        const readClientSpy = jest.spyOn(service, 'readClient').mockImplementationOnce(() => Promise.resolve(fakeClients[0]))
        await expect(service.updateClient(1, fakeClientCreateUpdate)).rejects.toThrow(new HttpException('Já existe um cliente com este email', 409))
        expect(readClientSpy).toHaveBeenCalledTimes(1);
        expect(readClientSpy).toHaveBeenCalledWith(1, expect.objectContaining({
            $transaction: expect.any(Function)
        }));
        expect(prisma.clientes.update).toHaveBeenCalledTimes(1);
        expect(prisma.clientes.update).toHaveBeenCalledWith({
            where: {cod: 1},
            data: fakeClientCreateUpdate
        });
    })

    it('Deleta um cliente específico', async()=>{
        const readClientSpy = jest.spyOn(service, 'readClient').mockImplementationOnce(() => Promise.resolve(fakeClients[0]))
        const resposta = await service.deleteClient(1);
        expect(resposta).toEqual(fakeClients[0]);
        expect(readClientSpy).toHaveBeenCalledTimes(1);
        expect(readClientSpy).toHaveBeenCalledWith(1, expect.objectContaining({
            $transaction: expect.any(Function)
        }));
        expect(prisma.clientes.delete).toHaveBeenCalledTimes(1);
        expect(prisma.clientes.delete).toHaveBeenCalledWith({
            where: {cod: 1}
        });
    })

    it('Deleta um cliente específico (que tem uma venda ou agendamento associado)', async()=>{
        prismaMock.clientes.delete.mockRejectedValueOnce({
            code: 'P2003'
        })
        const readClientSpy = jest.spyOn(service, 'readClient').mockImplementationOnce(() => Promise.resolve(fakeClients[0]))
        await expect(service.deleteClient(1)).rejects.toThrow(new HttpException("Não foi possivel excluir o cliente, pois ele tem pelo menos uma venda ou um agendamento associado", 409))
        expect(readClientSpy).toHaveBeenCalledTimes(1);
        expect(readClientSpy).toHaveBeenCalledWith(1, expect.objectContaining({
            $transaction: expect.any(Function)
        }));
        expect(prisma.clientes.delete).toHaveBeenCalledTimes(1);
        expect(prisma.clientes.delete).toHaveBeenCalledWith({
            where: {cod: 1}
        });
    })

    it('Deleta um cliente específico (não existente)', async()=>{
        const readClientSpy = jest.spyOn(service, 'readClient').mockRejectedValueOnce(
            new HttpException('O cliente não foi encontrado', HttpStatus.NOT_FOUND)
        )
        await expect(service.deleteClient(10)).rejects.toThrow(new HttpException('O cliente não foi encontrado', 404))
        expect(readClientSpy).toHaveBeenCalledTimes(1);
        expect(readClientSpy).toHaveBeenCalledWith(10, expect.objectContaining({
            $transaction: expect.any(Function)
        }));
        expect(prisma.clientes.delete).toHaveBeenCalledTimes(0);
    })


    it('Retorna as vendas e agendamentos por cliente', async()=>{
        const readSaleByClientSpy = jest.spyOn(vendaService, 'readSaleByClient')
        const readAppointmentByClientSpy = jest.spyOn(agendamentoService, 'readAppointmentByClient')
        const readClientSpy = jest.spyOn(service, 'readClient')

        const resposta = await service.readSaleAndAppointmentsByClient(1);

        
        expect(resposta).toEqual([{
            cod: 1,
            cod_op: 1,
            formaPgto: 'DEBITO',
            data: new Date('2023-01-03 12:00:00'),
            total: 7.50,
            tipo: 'Venda'
        },
        {
            cod: 2,
            cod_op: 2,
            formaPgto: 'CREDITO',
            data: new Date('2024-03-05 13:50:00'),
            total: 30.50,
            tipo: 'Venda'
        },
        {
            cod: 3,
            cod_op: 3,
            formaPgto: 'PIX',
            total: 240.00,
            data: new Date('2025-01-01 05:30:30'),
            tipo: 'Venda'
        },
        {
            cod: 4,
            cod_op: 1,
            formaPgto: 'DEBITO',
            data: new Date('2023-01-03 12:00:00'),
            total: 12.99,
            tipo: 'Agendamento'
        },
        {
            cod: 5,
            cod_op: 2,
            formaPgto: 'CREDITO',
            data: new Date('2024-03-05 13:50:00'),
            total: 53.65,
            tipo: 'Agendamento'
        },
        {
            cod: 6,
            cod_op: 3,
            formaPgto: 'PIX',
            data: new Date('2025-01-01 05:30:30'),
            total: 5.00,
            tipo: 'Agendamento'
        }
    ]);
        expect(readSaleByClientSpy).toHaveBeenCalledTimes(1);
        expect(readSaleByClientSpy).toHaveBeenCalledWith(1, expect.objectContaining({
            $transaction: expect.any(Function)
        }));
        expect(readAppointmentByClientSpy).toHaveBeenCalledTimes(1);
        expect(readAppointmentByClientSpy).toHaveBeenCalledWith(1, expect.objectContaining({
            $transaction: expect.any(Function)
        }));

        expect(readClientSpy).toHaveBeenCalledWith(1, expect.objectContaining({
            $transaction: expect.any(Function)
        }));
    })

    it('Retorna as vendas e agendamentos por cliente (cliente inexistente)', async()=>{
        const readSaleByClientSpy = jest.spyOn(vendaService, 'readSaleByClient')
        const readAppointmentByClientSpy = jest.spyOn(agendamentoService, 'readAppointmentByClient')
        const readClientSpy = jest.spyOn(service, 'readClient').mockRejectedValueOnce(
            new HttpException('O cliente não foi encontrado', HttpStatus.NOT_FOUND)
        )

        await expect(service.readSaleAndAppointmentsByClient(10)).rejects.toThrow(new HttpException('O cliente não foi encontrado', 404))

        expect(readSaleByClientSpy).toHaveBeenCalledTimes(0);
    
        expect(readAppointmentByClientSpy).toHaveBeenCalledTimes(0);
        expect(readClientSpy).toHaveBeenCalledWith(10, expect.objectContaining({
            $transaction: expect.any(Function)
        }));
    })
})
/*https://dev.to/mrtinsvitor/testes-com-nestjs-e-prisma-24bo*/


