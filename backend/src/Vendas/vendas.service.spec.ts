import { Test } from '@nestjs/testing';
import { PrismaService } from '../Prisma/prisma.service';
import { HttpException, HttpStatus } from '@nestjs/common';
import { FormasPagamento, Status } from "@prisma/client"
import { VendasService } from './vendas.service';
import { ProdutosService } from '../Produtos/produtos.service';
import Decimal from 'decimal.js'
import { AgendamentosService } from '../Agendamentos/agendamentos.service';
import { ClientesService } from '../Clientes/clientes.service';

const fakeVendaCreateOrUpdate =
{
    cliente_id: 3,
    data: new Date('2025-01-01 05:30:30'),
    formaPgto: 'PIX' as FormasPagamento ,
    itens: [
        {
            produto_id: 1,
            quantidade: 3
        },
        {
            produto_id: 2,
            quantidade: 12
        },
        {
            produto_id: 3,
            quantidade: 3
        }

    ]
}

const fakeVendasSelectMany =[
        {
            cod: 1,
            cliente_id: 1,
            data: new Date('2023-01-03 12:00:00'),
            formaPgto: 'DEBITO' as FormasPagamento ,
            itens: [
                {
                    cod: 1,
                    venda_id: 1,
                    produto_id: 1,
                    quantidade: 3,
                    total: 7.50
                }
            ]
        },
        {
            cod: 2,
            cliente_id: 2,
            data: new Date('2024-03-05 13:50:00'),
            formaPgto: 'CREDITO' as FormasPagamento,
            itens: [
                {
                    cod: 2,
                    venda_id: 2,
                    produto_id: 1,
                    quantidade: 5,
                    total: 10.50
                },
                {
                    cod: 3,
                    venda_id: 2,
                    produto_id: 2,
                    quantidade: 6,
                    total: 20.00
                }
            ]
        },
        {
            cod: 3,
            cliente_id: 3,
            data: new Date('2025-01-01 05:30:30'),
            formaPgto: 'PIX' as FormasPagamento ,
            itens: [
                {
                    cod: 4,
                    venda_id: 3,
                    produto_id: 1,
                    quantidade: 10,
                    total: 21.00
                },
                {
                    cod: 5,
                    venda_id: 3,
                    produto_id: 2,
                    quantidade: 20,
                    total: 200.00
                },
                {
                    cod: 6,
                    venda_id: 3,
                    produto_id: 3,
                    quantidade: 3,
                    total: 19.00
                }
            ]
        }
]


const fakeVendasYear = [
    {
        cod: 1,
        cliente_id: 1,
        data: new Date('2025-01-03 12:00:00'),
        formaPgto: 'DEBITO' as FormasPagamento ,
        itens: [
            {
                cod: 1,
                venda_id: 1,
                produto_id: 1,
                quantidade: 3,
                total: 7.50
            }
        ]
    },
    {
        cod: 2,
        cliente_id: 2,
        data: new Date('2025-03-05 13:50:00'),
        formaPgto: 'CREDITO' as FormasPagamento,
        itens: [
            {
                cod: 2,
                venda_id: 2,
                produto_id: 1,
                quantidade: 5,
                total: 10.50
            },
            {
                cod: 3,
                venda_id: 2,
                produto_id: 2,
                quantidade: 6,
                total: 20.00
            }
        ]
    },
    {
        cod: 3,
        cliente_id: 3,
        data: new Date('2025-01-01 05:30:30'),
        formaPgto: 'PIX' as FormasPagamento ,
        itens: [
            {
                cod: 4,
                venda_id: 3,
                produto_id: 1,
                quantidade: 10,
                total: 21.00
            },
            {
                cod: 5,
                venda_id: 3,
                produto_id: 2,
                quantidade: 20,
                total: 200.00
            },
            {
                cod: 6,
                venda_id: 3,
                produto_id: 3,
                quantidade: 3,
                total: 19.00
            }
        ]
    }
]

const fakeVendasYearEsperado = [{
    receita: 278,
    quantidade: 47,
    vendasInfo: [
        {
            salesTotal: 247.5,
            quantityItensSales:36
        },
        {
            salesTotal: 0,
            quantityItensSales:0
        },
        {
            salesTotal: 30.50,
            quantityItensSales:11
        },
        {
            salesTotal: 0,
            quantityItensSales:0
        },
        {
            salesTotal: 0,
            quantityItensSales:0
        },
        {
            salesTotal: 0,
            quantityItensSales:0
        },
        {
            salesTotal: 0,
            quantityItensSales:0
        },
        {
            salesTotal: 0,
            quantityItensSales:0
        },
        {
            salesTotal: 0,
            quantityItensSales:0
        },
        {
            salesTotal: 0,
            quantityItensSales:0
        },
        {
            salesTotal: 0,
            quantityItensSales:0
        },
        {
            salesTotal: 0,
            quantityItensSales:0
        }
    ]
    
}
]


const fakeVendasSelectUnique =[
    {
        cod: 1,
        cliente_id: 1,
        data: new Date('2023-01-03 12:00:00'),
        formaPgto: 'DEBITO' as FormasPagamento ,
        itens: [
            {
                cod: 1,
                venda_id: 1,
                produto_id: 1,
                quantidade: 3,
                total: new Decimal(7.50),
                produto: {
                    cod: 1,
                    nome: 'Produto 1',
                    marca: 'Marca 1',
                    preco: new Decimal(12.99),
                    quantidade: 34,
                    fornecedor: 'Fornecedor 1'
                }
            }
        ],
        cliente: {
            cod: 1,
            nome: 'Cliente 1',
            cpf: '12345678909',
            email: 'cliente1@gmail.com',
            telefone: '19123456789',
            endereco: 'Rua cliente 1',
        }
    },
    {
        cod: 2,
        cliente_id: 2,
        data: new Date('2024-03-05 13:50:00'),
        formaPgto: 'CREDITO' as FormasPagamento,
        itens: [
            {
                cod: 2,
                venda_id: 2,
                produto_id: 1,
                quantidade: 5,
                total: new Decimal(10.50),
                produto: {
                    cod: 1,
                    nome: 'Produto 1',
                    marca: 'Marca 1',
                    preco: new Decimal(12.99),
                    quantidade: 34,
                    fornecedor: 'Fornecedor 1'
                }
            },
            {
                cod: 3,
                venda_id: 2,
                produto_id: 2,
                quantidade: 6,
                total: new Decimal(20.00),
                produto: {
                    cod: 2,
                    nome: 'Produto 2',
                    marca: 'Marca 2',
                    preco: new Decimal(3.50),
                    quantidade: 12,
                    fornecedor: 'Fornecedor 2'
                }
            }
        ],
        cliente: {
            cod: 2,
            nome: 'Cliente 2',
            cpf: '99999999999',
            email: 'cliente2@gmail.com',
            telefone: '19999999999',
            endereco: 'Rua cliente 2',
        }
    },
    {
        cod: 3,
        cliente_id: 3,
        data: new Date('2025-01-01 05:30:30'),
        formaPgto: 'PIX' as FormasPagamento ,
        itens: [
            {
                cod: 4,
                venda_id: 3,
                produto_id: 1,
                quantidade: 10,
                total: new Decimal(21.00),
                produto: {
                    cod: 1,
                    nome: 'Produto 1',
                    marca: 'Marca 1',
                    preco: new Decimal(12.99),
                    quantidade: 34,
                    fornecedor: 'Fornecedor 1'
                }
            },
            {
                cod: 5,
                venda_id: 3,
                produto_id: 2,
                quantidade: 20,
                total: new Decimal(200.00),
                produto: {
                    cod: 2,
                    nome: 'Produto 2',
                    marca: 'Marca 2',
                    preco: new Decimal(3.50),
                    quantidade: 12,
                    fornecedor: 'Fornecedor 2'
                }
            },
            {
                cod: 6,
                venda_id: 3,
                produto_id: 3,
                quantidade: 3,
                total: new Decimal(19.00),
                produto: {
                    cod: 3,
                    nome: 'Produto 3',
                    marca: 'Marca 3',
                    preco: new Decimal(50.35),
                    quantidade: 78,
                    fornecedor: 'Fornecedor 3'
                }
            }
        ],
        cliente: {
            cod: 3,
            nome: 'Cliente 3',
            cpf: '90987654321',
            email: 'cliente3@gmail.com',
            telefone: '19123456789',
            endereco: 'Rua cliente 3',
        }
    }
]


const selectManyEsperado = [
    {
        cod: 1,
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
                total: 7.50
            }
        ]
    },
    {
        cod: 2,
        cliente_id: 2,
        data: new Date('2024-03-05 13:50:00'),
        formaPgto: 'CREDITO' as FormasPagamento,
        totalVenda: 30.50,
        itens: [
            {
                cod: 2,
                venda_id: 2,
                produto_id: 1,
                quantidade: 5,
                total: 10.50
            },
            {
                cod: 3,
                venda_id: 2,
                produto_id: 2,
                quantidade: 6,
                total: 20.00
            }
        ]
    },
    {
        cod: 3,
        cliente_id: 3,
        data: new Date('2025-01-01 05:30:30'),
        formaPgto: 'PIX' as FormasPagamento ,
        totalVenda: 240.00,
        itens: [
            {
                cod: 4,
                venda_id: 3,
                produto_id: 1,
                quantidade: 10,
                total: 21.00
            },
            {
                cod: 5,
                venda_id: 3,
                produto_id: 2,
                quantidade: 20,
                total: 200.00
            },
            {
                cod: 6,
                venda_id: 3,
                produto_id: 3,
                quantidade: 3,
                total: 19.00
            }
        ]
    }
]

const fakeVendas = [
    {
        cod: 1,
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
                total: 7.50
            }
        ]
    },
    {
        cod: 2,
        cliente_id: 2,
        data: new Date('2024-03-05 13:50:00'),
        formaPgto: 'CREDITO' as FormasPagamento,
        totalVenda: 30.50,
        itens: [
            {
                cod: 2,
                venda_id: 2,
                produto_id: 1,
                quantidade: 5,
                total: 10.50
            },
            {
                cod: 3,
                venda_id: 2,
                produto_id: 2,
                quantidade: 6,
                total: 20.00
            }
        ]
    },
    {
        cod: 3,
        cliente_id: 3,
        data: new Date('2025-01-01 05:30:30'),
        formaPgto: 'PIX' as FormasPagamento ,
        totalVenda: 260.02,
        itens: [
            {
                cod: 4,
                venda_id: 3,
                produto_id: 1,
                quantidade: 10,
                total: 38.97
            },
            {
                cod: 5,
                venda_id: 3,
                produto_id: 2,
                quantidade: 20,
                total: 70.00
            },
            {
                cod: 6,
                venda_id: 3,
                produto_id: 3,
                quantidade: 3,
                total: 151.05
            }
        ]
    }
]

const prismaMock = {
    $transaction: jest.fn(async (callback) => callback(prismaMock)),
    vendas: {
        create: jest.fn().mockImplementation(() => Promise.resolve(fakeVendas[2])),
        findMany: jest.fn().mockImplementation(() => Promise.resolve(fakeVendasSelectMany)),
        findUnique: jest.fn().mockImplementation(() => Promise.resolve(fakeVendasSelectUnique[0])),
        update: jest.fn().mockImplementation(() => Promise.resolve(fakeVendas[2])),
        delete: jest.fn().mockImplementation(() => Promise.resolve(fakeVendas[0]))
    },
    itensVenda:{
        createMany: jest.fn().mockImplementation(() => Promise.resolve(null)), //Colocar dados
        findMany: jest.fn().mockImplementation(() => Promise.resolve(null)),
        deleteMany: jest.fn().mockImplementation(() => Promise.resolve(null))
    }
}

const produtosMock = {
    readManyProducts: jest.fn().mockImplementation(() => Promise.resolve([
        {
            cod: 1,
            nome: 'Produto 1',
            preco: new Decimal(12.99),
            quantidade: 34,
        },
        {
            cod: 2,
            nome: 'Produto 2',
            preco: new Decimal(3.50),
            quantidade: 23,
        },
        {
            cod: 3,
            nome: 'Produto 3',
            preco: new Decimal(50.35),
            quantidade: 78,
        }
    ])),
    updateProduct: jest.fn().mockImplementation(() => Promise.resolve(null))
}

const clienteMock = {
    readClient: jest.fn().mockImplementation(() => Promise.resolve({
        cod: 3,
        nome: 'Cliente 3',
        cpf: '90987654321',
        email: 'cliente3@gmail.com',
        telefone: '19123456789',
        endereco: 'Rua cliente 3',
    }))
}

describe('Serviço de Vendas', () => {
    let service: VendasService;
    let prisma: PrismaService;
    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                VendasService,
                ProdutosService,
                ClientesService,
                {provide: ProdutosService, useValue: produtosMock},
                {provide: ClientesService, useValue: clienteMock},
                {provide: PrismaService, useValue: prismaMock},
                {
                    provide: 'forwardRef(() => ClientesService)',
                    useExisting:  ClientesService
                }
            ]
        }).compile()

        service = module.get<VendasService>(VendasService)
        prisma = module.get<PrismaService>(PrismaService)
    }),
    afterEach(()=>{
        jest.clearAllMocks()
    })
    
    it('Retorna as vendas', async()=>{
        const resposta = await service.readSales();
        expect(resposta).toEqual(selectManyEsperado);
        expect(prisma.vendas.findMany).toHaveBeenCalledTimes(1);
        expect(prisma.vendas.findMany).toHaveBeenCalledWith({
            include: {
                itens: true
            }
        });
    })
    
    it('Retorna uma venda específica', async()=>{
        const resposta = await service.readSale(1);
        expect(resposta).toEqual({...fakeVendasSelectUnique[0], totalVenda: 7.5});
        expect(prisma.vendas.findUnique).toHaveBeenCalledTimes(1);
        expect(prisma.vendas.findUnique).toHaveBeenCalledWith({
            where: {cod: 1},
            include: {
                itens: {
                    include: {
                        produto: true
                    }
                },
                cliente: true
                
            }
        });
    })
    
    it('Retorna uma venda específica (não existente)', async()=>{
        prismaMock.vendas.findUnique.mockImplementationOnce(() => Promise.resolve(null))
        await expect(service.readSale(10)).rejects.toThrow(new HttpException('A venda não foi encontrada', 404))
        expect(prisma.vendas.findUnique).toHaveBeenCalledTimes(1);
        expect(prisma.vendas.findUnique).toHaveBeenCalledWith({
            where: {cod: 10},
            include: {
                itens: {
                    include: {
                        produto: true
                    }
                },
                cliente: true
                
            }
        });
    })
    
    it('Deleta uma venda específica', async()=>{
        const readSaleSpy = jest.spyOn(service, 'readSale').mockImplementationOnce(() => Promise.resolve({...fakeVendasSelectUnique[0], totalVenda: 7.5}))
        const resposta = await service.deleteSale(1);
        expect(resposta).toEqual(fakeVendas[0]);
        expect(readSaleSpy).toHaveBeenCalledTimes(1);
        expect(readSaleSpy).toHaveBeenCalledWith(1, expect.objectContaining({
            $transaction: expect.any(Function)
        }));
        expect(prisma.vendas.delete).toHaveBeenCalledTimes(1);
        expect(prisma.vendas.delete).toHaveBeenCalledWith({
            where: {cod: 1}
        });
    })
    
    it('Deleta uma venda específica (não existente)', async()=>{
        const readSaleSpy = jest.spyOn(service, 'readSale').mockRejectedValueOnce(
            new HttpException('A venda não foi encontrada', HttpStatus.NOT_FOUND)
        )
        await expect(service.deleteSale(10)).rejects.toThrow(new HttpException('A venda não foi encontrada', 404))
        expect(readSaleSpy).toHaveBeenCalledTimes(1);
        expect(readSaleSpy).toHaveBeenCalledWith(10, expect.objectContaining({
            $transaction: expect.any(Function)
        }));
        expect(prisma.vendas.delete).toHaveBeenCalledTimes(0);
    })

    it('Retorna as vendas por cliente', async()=>{
        const fakeData = [{ cod: 1,
        cliente_id: 1,
        data: new Date('2023-01-03 12:00:00'),
        formaPgto: 'DEBITO' as FormasPagamento ,
        itens: [
            {
                cod: 1,
                venda_id: 1,
                produto_id: 1,
                quantidade: 3,
                total: 7.50
            }
        ]
        },
        {
            cod: 2,
            cliente_id: 1,
            data: new Date('2024-03-05 13:50:00'),
            formaPgto: 'CREDITO' as FormasPagamento,
            itens: [
                {
                    cod: 2,
                    venda_id: 2,
                    produto_id: 1,
                    quantidade: 5,
                    total: 10.50
                },
                {
                    cod: 3,
                    venda_id: 2,
                    produto_id: 2,
                    quantidade: 6,
                    total: 20.00
                }
            ]
        },
        {
            cod: 3,
            cliente_id: 1,
            data: new Date('2025-01-01 05:30:30'),
            formaPgto: 'PIX' as FormasPagamento ,
            
            itens: [
                {
                    cod: 4,
                    venda_id: 3,
                    produto_id: 1,
                    quantidade: 10,
                    total: 21.00
                },
                {
                    cod: 5,
                    venda_id: 3,
                    produto_id: 2,
                    quantidade: 20,
                    total: 200.00
                },
                {
                    cod: 6,
                    venda_id: 3,
                    produto_id: 3,
                    quantidade: 3,
                    total: 19.00
                }
            ]
        }]

        const fakeDataWithTotal = [{ cod: 1,
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
                    total: 7.50
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
                        total: 10.50
                    },
                    {
                        cod: 3,
                        venda_id: 2,
                        produto_id: 2,
                        quantidade: 6,
                        total: 20.00
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
                        total: 21.00
                    },
                    {
                        cod: 5,
                        venda_id: 3,
                        produto_id: 2,
                        quantidade: 20,
                        total: 200.00
                    },
                    {
                        cod: 6,
                        venda_id: 3,
                        produto_id: 3,
                        quantidade: 3,
                        total: 19.00
                    }
                ]
            }]

        prismaMock.vendas.findMany.mockImplementationOnce(() => Promise.resolve(fakeData))
        const resposta = await service.readSaleByClient(1);
        expect(resposta).toEqual(fakeDataWithTotal);
        expect(prisma.vendas.findMany).toHaveBeenCalledTimes(1);
        expect(prisma.vendas.findMany).toHaveBeenCalledWith({
            where: {
                cliente_id: 1
            },
            include: {
                itens: true
            }
        });
    })

    
    it('Criar uma venda', async()=>{
        const resposta = await service.createSale(fakeVendaCreateOrUpdate);
        expect(resposta).toEqual([]);
        expect(produtosMock.readManyProducts).toHaveBeenCalledTimes(1);
        expect(prismaMock.vendas.create).toHaveBeenCalledTimes(1);
        expect(prismaMock.vendas.create).toHaveBeenCalledWith({
            data:{
                cliente_id: 3,
                data: new Date('2025-01-01 05:30:30'),
                formaPgto: 'PIX' as FormasPagamento
            }
        });
        expect(prismaMock.itensVenda.createMany).toHaveBeenCalledTimes(1);
        expect(prismaMock.itensVenda.createMany).toHaveBeenCalledWith({
            data: [
                {
                    venda_id: 3,
                    produto_id: 1,
                    quantidade: 3,
                    total: 38.97 
                },
                {
                    venda_id: 3,
                    produto_id: 2,
                    quantidade: 12,
                    total: 42.00
                },
                {
                    venda_id: 3,
                    produto_id: 3,
                    quantidade: 3,
                    total: 151.05
                }
            ]
        });
        expect(produtosMock.readManyProducts).toHaveBeenCalledWith(expect.arrayContaining([
            {
                produto_id: 1,
                quantidade: 3
            },
            {
                produto_id: 2,
                quantidade: 12
            },
            {
                produto_id: 3,
                quantidade: 3
            },
        ]), expect.objectContaining({
            $transaction: expect.any(Function)
        }) );

        expect(produtosMock.updateProduct).toHaveBeenCalledTimes(3);
        
        expect(produtosMock.updateProduct).toHaveBeenCalledWith(1, {
            cod: 1,
            nome: 'Produto 1',
            preco: new Decimal(12.99),
            quantidade: 31,
        },
        expect.objectContaining({
            $transaction: expect.any(Function)
        })
        )

        expect(produtosMock.updateProduct).toHaveBeenCalledWith(2, {
            cod: 2,
            nome: 'Produto 2',
            preco: new Decimal(3.50),
            quantidade: 11,
        },
        expect.objectContaining({
            $transaction: expect.any(Function)
        })
        )

        expect(produtosMock.updateProduct).toHaveBeenCalledWith(3, {
            cod: 3,
            nome: 'Produto 3',
            preco: new Decimal(50.35),
            quantidade: 75,
        },
        expect.objectContaining({
            $transaction: expect.any(Function)
        })
        )
        expect(clienteMock.readClient).toHaveBeenCalledTimes(1);
        expect(clienteMock.readClient).toHaveBeenCalledWith(3, expect.objectContaining({
            $transaction: expect.any(Function)
        }));
    })
    
    it('Criar uma venda (deixando item com pouco estoque)', async()=>{
        produtosMock.readManyProducts.mockImplementationOnce(() => Promise.resolve([
            {
                cod: 1,
                nome: 'Produto 1',
                preco: new Decimal(12.99),
                quantidade: 34,
            },
            {
                cod: 2,
                nome: 'Produto 2',
                preco: new Decimal(3.50),
                quantidade: 23,
            },
            {
                cod: 3,
                nome: 'Produto 3',
                preco: new Decimal(50.35),
                quantidade: 78,
            }
        ]))

        const resposta = await service.createSale({
            cliente_id: 3,
            data: new Date('2025-01-01 05:30:30'),
            formaPgto: 'PIX' as FormasPagamento ,
            itens: [
                {
                    produto_id: 1,
                    quantidade: 30
                },
                {
                    produto_id: 2,
                    quantidade: 20
                },
                {
                    produto_id: 3,
                    quantidade: 3
                }

            ]
        });
        expect(resposta).toEqual([{"produto": "Produto 1", "quantidade": 4}, {"produto": "Produto 2", "quantidade": 3}]);
        expect(produtosMock.readManyProducts).toHaveBeenCalledTimes(1);
        expect(prismaMock.vendas.create).toHaveBeenCalledTimes(1);
        expect(prismaMock.vendas.create).toHaveBeenCalledWith({
            data:{
                cliente_id: 3,
                data: new Date('2025-01-01 05:30:30'),
                formaPgto: 'PIX' as FormasPagamento
            }
        });
        expect(prismaMock.itensVenda.createMany).toHaveBeenCalledTimes(1);
        expect(prismaMock.itensVenda.createMany).toHaveBeenCalledWith({
            data: [
                {
                    venda_id: 3,
                    produto_id: 1,
                    quantidade: 30,
                    total: 389.70,
                },
                {
                    venda_id: 3,
                    produto_id: 2,
                    quantidade: 20,
                    total: 70.00
                },
                {
                    venda_id: 3,
                    produto_id: 3,
                    quantidade: 3,
                    total: 151.05
                }
            ]
        });
        expect(produtosMock.readManyProducts).toHaveBeenCalledWith(expect.arrayContaining([
            {
                produto_id: 1,
                quantidade: 30
            },
            {
                produto_id: 2,
                quantidade: 20
            },
            {
                produto_id: 3,
                quantidade: 3
            },
        ]), expect.objectContaining({
            $transaction: expect.any(Function)
        }) );

        expect(produtosMock.updateProduct).toHaveBeenCalledTimes(3);
        
        expect(produtosMock.updateProduct).toHaveBeenCalledWith(1, {
            cod: 1,
            nome: 'Produto 1',
            preco: new Decimal(12.99),
            quantidade: 4,
        },
        expect.objectContaining({
            $transaction: expect.any(Function)
        })
        )

        expect(produtosMock.updateProduct).toHaveBeenCalledWith(2, {
            cod: 2,
            nome: 'Produto 2',
            preco: new Decimal(3.50),
            quantidade: 3,
        },
        expect.objectContaining({
            $transaction: expect.any(Function)
        })
        )

        expect(produtosMock.updateProduct).toHaveBeenCalledWith(3, {
            cod: 3,
            nome: 'Produto 3',
            preco: new Decimal(50.35),
            quantidade: 75,
        },
        expect.objectContaining({
            $transaction: expect.any(Function)
        })
        )
        expect(clienteMock.readClient).toHaveBeenCalledTimes(1);
        expect(clienteMock.readClient).toHaveBeenCalledWith(3, expect.objectContaining({
            $transaction: expect.any(Function)
        }));
    })
    
    it('Criar uma venda (sem itens)', async()=>{
        prismaMock.vendas.create.mockImplementationOnce(() => Promise.resolve({
            cod: 3,
            cliente_id: 3,
            data: new Date('2025-01-01 05:30:30'),
            formaPgto: 'PIX' as FormasPagamento,
            totalVenda: 0,
            itens: []
        }))

        const resposta = await service.createSale({
            cliente_id: 3,
            data: new Date('2025-01-01 05:30:30'),
            formaPgto: 'PIX' as FormasPagamento,
            itens: []
        });
        expect(resposta).toEqual(
            []
        );

        expect(prismaMock.vendas.create).toHaveBeenCalledTimes(1);
        expect(prismaMock.vendas.create).toHaveBeenCalledWith({
            data: {cliente_id: 3,
            data: new Date('2025-01-01 05:30:30'),
            formaPgto: 'PIX' as FormasPagamento}
        });
        
        expect(produtosMock.readManyProducts).toHaveBeenCalledTimes(0);
        expect(prismaMock.itensVenda.createMany).toHaveBeenCalledTimes(0);
        expect(produtosMock.updateProduct).toHaveBeenCalledTimes(0);
        expect(clienteMock.readClient).toHaveBeenCalledTimes(1);
        expect(clienteMock.readClient).toHaveBeenCalledWith(3, expect.objectContaining({
            $transaction: expect.any(Function)
        }));
    })
    
    it('Criar uma venda (com itens repetidos)', async()=>{
        prismaMock.itensVenda.createMany.mockRejectedValueOnce({
            code: 'P2002',
            message: 'itensVenda'
        })
        prismaMock.vendas.create.mockImplementationOnce(() => Promise.resolve({
            cod: 3,
            cliente_id: 3,
            data: new Date('2025-01-01 05:30:30'),
            formaPgto: 'PIX' as FormasPagamento ,
        }))

        produtosMock.readManyProducts.mockImplementationOnce(() => Promise.resolve([
            {
                cod: 1,
                nome: 'Produto 1',
                preco: new Decimal(12.99),
                quantidade: 34,
            },
            {
                cod: 2,
                nome: 'Produto 2',
                preco: new Decimal(3.50),
                quantidade: 23,
            },
            {
                cod: 1,
                nome: 'Produto 1',
                preco: new Decimal(12.99),
                quantidade: 34
            }
        ]))
        await expect(service.createSale({
            cliente_id: 3,
            data: new Date('2025-01-01 05:30:30'),
            formaPgto: 'PIX' as FormasPagamento,
            itens: [
                {
                    produto_id: 1,
                    quantidade: 3
                },
                {
                    produto_id: 2,
                    quantidade: 20
                },
                {
                    produto_id: 1,
                    quantidade: 3
                }
            ]
        })
    ).rejects.toThrow(new HttpException('Há um produto repetido na venda', 409))

        expect(produtosMock.readManyProducts).toHaveBeenCalledTimes(1);
        expect(prismaMock.vendas.create).toHaveBeenCalledTimes(1);

        expect(prismaMock.itensVenda.createMany).toHaveBeenCalledTimes(1);
        expect(prismaMock.itensVenda.createMany).toHaveBeenCalledWith({
            data: [
                {
                    venda_id: 3,
                    produto_id: 1,
                    quantidade: 3,
                    total: 38.97 
                },
                {
                    venda_id: 3,
                    produto_id: 2,
                    quantidade: 20,
                    total: 70.00
                },
                {
                    venda_id: 3,
                    produto_id: 1,
                    quantidade: 3,
                    total: 38.97 
                }
            ]
        });

        expect(produtosMock.updateProduct).toHaveBeenCalledTimes(3);
        
        expect(produtosMock.updateProduct).toHaveBeenCalledWith(1, {
            cod: 1,
            nome: 'Produto 1',
            preco: new Decimal(12.99),
            quantidade: 31
        },
        expect.objectContaining({
            $transaction: expect.any(Function)
        })
        )

        expect(produtosMock.updateProduct).toHaveBeenCalledWith(2, {
            cod: 2,
            nome: 'Produto 2',
            preco: new Decimal(3.50),
            quantidade: 3
        },
        expect.objectContaining({
            $transaction: expect.any(Function)
        })
        )

        expect(produtosMock.updateProduct).toHaveBeenCalledWith(1, {
            cod: 1,
            nome: 'Produto 1',
            preco: new Decimal(12.99),
            quantidade: 28
        },
        expect.objectContaining({
            $transaction: expect.any(Function)
        })
        )

        expect(clienteMock.readClient).toHaveBeenCalledTimes(1);
        expect(clienteMock.readClient).toHaveBeenCalledWith(3, expect.objectContaining({
            $transaction: expect.any(Function)
        }));

    })

    
    it('Criar uma venda (item sem estoque)', async()=>{
        prismaMock.vendas.create.mockImplementationOnce(() => Promise.resolve({
            cod: 2,
            cliente_id: 2,
            data: new Date('2025-01-01 05:30:30'),
            formaPgto: 'PIX' as FormasPagamento ,
        }))

        produtosMock.readManyProducts.mockImplementationOnce(() => Promise.resolve([
            {
                cod: 1,
                nome: 'Produto 1',
                preco: new Decimal(12.99),
                quantidade: 34,
            },
            {
                cod: 2,
                nome: 'Produto 2',
                preco: new Decimal(3.50),
                quantidade: 23,
            }
        ]))
        await expect(service.createSale({
            cliente_id: 2,
            data: new Date('2025-01-01 05:30:30'),
            formaPgto: 'PIX' as FormasPagamento,
            itens: [
                {
                    produto_id: 1,
                    quantidade: 3
                },
                {
                    produto_id: 2,
                    quantidade: 35
                }
            ]
        })
    ).rejects.toThrow( new HttpException('Não há quantidade suficiente do produto Produto 2', 409))

    
    expect(prismaMock.vendas.create).toHaveBeenCalledWith({
                data:{
                    cliente_id: 2,
                    data: new Date('2025-01-01 05:30:30'),
                    formaPgto: 'PIX' as FormasPagamento,
                }
    });

    expect(prismaMock.itensVenda.createMany).toHaveBeenCalledTimes(0);
    expect(produtosMock.readManyProducts).toHaveBeenCalledTimes(1);

    expect(produtosMock.readManyProducts).toHaveBeenCalledWith( [
            {
                produto_id: 1,
                quantidade: 3
            },
            {
                produto_id: 2,
                quantidade: 35
            },
            ], expect.objectContaining({
            $transaction: expect.any(Function)
        }) );

        expect(produtosMock.updateProduct).toHaveBeenCalledTimes(1);

        expect(produtosMock.updateProduct).toHaveBeenCalledWith(1, {
                cod: 1,
                nome: 'Produto 1',
                preco: new Decimal(12.99),
                quantidade: 31,
                },
                expect.objectContaining({
                    $transaction: expect.any(Function)
        }))
        expect(clienteMock.readClient).toHaveBeenCalledTimes(1);
        expect(clienteMock.readClient).toHaveBeenCalledWith(2, expect.objectContaining({
            $transaction: expect.any(Function)
        }));
    })
    
    it('Criar uma venda (item inexistente)', async()=>{
        prismaMock.vendas.create.mockImplementationOnce(() => Promise.resolve({
            cod: 2,
            cliente_id: 2,
            data: new Date('2025-01-01 05:30:30'),
            formaPgto: 'PIX' as FormasPagamento ,
        }))
        produtosMock.readManyProducts.mockImplementationOnce(() => Promise.resolve([
            {
                cod: 1,
                nome: 'Produto 1',
                preco: new Decimal(12.99),
                quantidade: 34,
            }
        ]))
        await expect(service.createSale({
            cliente_id: 2,
            data: new Date('2025-01-01 05:30:30'),
            formaPgto: 'PIX' as FormasPagamento,
            itens: [
                {
                    produto_id: 1,
                    quantidade: 3
                },
                {
                    produto_id: 2,
                    quantidade: 20
                }
            ]
        })
        ).rejects.toThrow(new HttpException('O produto 2 não foi encontrado na base de dados', 404))


        expect(prismaMock.vendas.create).toHaveBeenCalledTimes(1);
        expect(prismaMock.vendas.create).toHaveBeenCalledWith({
            data:{
                cliente_id: 2,
                data: new Date('2025-01-01 05:30:30'),
                formaPgto: 'PIX' as FormasPagamento,
            }
        });

        expect(prismaMock.itensVenda.createMany).toHaveBeenCalledTimes(0);
        expect(produtosMock.readManyProducts).toHaveBeenCalledTimes(1);

        expect(produtosMock.readManyProducts).toHaveBeenCalledWith( [
            {
                produto_id: 1,
                quantidade: 3
            },
            {
                produto_id: 2,
                quantidade: 20
            },
            ], expect.objectContaining({
            $transaction: expect.any(Function)
        }) );

        expect(produtosMock.updateProduct).toHaveBeenCalledTimes(1);

        expect(produtosMock.updateProduct).toHaveBeenCalledWith(1, {
                cod: 1,
                nome: 'Produto 1',
                preco: new Decimal(12.99),
                quantidade: 31,
                },
                expect.objectContaining({
                    $transaction: expect.any(Function)
        }))

        expect(produtosMock.readManyProducts).toHaveBeenCalledTimes(1);
        expect(clienteMock.readClient).toHaveBeenCalledTimes(1);
        expect(clienteMock.readClient).toHaveBeenCalledWith(2, expect.objectContaining({
            $transaction: expect.any(Function)
        }));
    })
    
    it('Criar uma venda (cliente inexistente)', async()=>{
        clienteMock.readClient.mockRejectedValueOnce(
            new HttpException('O cliente não foi encontrado', HttpStatus.NOT_FOUND)
        )

        await expect(service.createSale(fakeVendaCreateOrUpdate)).rejects.toThrow(new HttpException('O cliente não foi encontrado', 404))
 
        expect(produtosMock.readManyProducts).toHaveBeenCalledTimes(0);
        expect(prismaMock.vendas.create).toHaveBeenCalledTimes(0);
        expect(prismaMock.itensVenda.createMany).toHaveBeenCalledTimes(0);
        expect(produtosMock.updateProduct).toHaveBeenCalledTimes(0);
        expect(clienteMock.readClient).toHaveBeenCalledTimes(1);
        expect(clienteMock.readClient).toHaveBeenCalledWith(3, expect.objectContaining({
            $transaction: expect.any(Function)
        }));
    })
    
    it('Atualizar uma venda', async()=>{

        /*Atualiza para todos abaixo*/ 
        clienteMock.readClient.mockImplementation(() => Promise.resolve({
            cod: 2,
            nome: 'Cliente 2',
            cpf: '99999999999',
            email: 'cliente2@gmail.com',
            telefone: '19999999999',
            endereco: 'Rua cliente 2',
        }))

        const readSaleSpy = jest.spyOn(service, 'readSale').mockImplementationOnce(() => Promise.resolve({
            cod: 3,
            cliente_id: 3,
            data: new Date('2025-01-01 05:30:30'),
            formaPgto: 'PIX' as FormasPagamento ,
            totalVenda: 199.90,
            itens: [
                {
                    cod: 4,
                    venda_id: 3,
                    produto_id: 1,
                    quantidade: 10,
                    total: new Decimal(129.90),
                    produto: {
                        cod: 1,
                        nome: 'Produto 1',
                        marca: 'Marca 1',
                        preco: new Decimal(12.99),
                        quantidade: 34,
                        fornecedor: 'Fornecedor 1'
                    }
                },
                {
                    cod: 5,
                    venda_id: 3,
                    produto_id: 2,
                    quantidade: 20,
                    total: new Decimal(70.00),
                    produto: {
                        cod: 2,
                        nome: 'Produto 2',
                        marca: 'Marca 2',
                        preco: new Decimal(3.50),
                        quantidade: 23,
                        fornecedor: 'Fornecedor 2'
                    }
                }
            ],
            cliente: {
                cod: 3,
                nome: 'Cliente 3',
                cpf: '90987654321',
                email: 'cliente3@gmail.com',
                telefone: '19123456789',
                endereco: 'Rua cliente 3',
            }
        }))
        
        prismaMock.itensVenda.findMany.mockImplementationOnce(() => Promise.resolve([
            {
                cod: 4,
                venda_id: 3,
                produto_id: 1,
                quantidade: 10,
                total: new Decimal(129.90),
                produto: {
                    cod: 1,
                    nome: 'Produto 1',
                    marca: 'Marca 1',
                    preco: new Decimal(12.99),
                    quantidade: 34,
                    fornecedor: 'Fornecedor 1'
                }
            },
            {
                cod: 5,
                venda_id: 3,
                produto_id: 2,
                quantidade: 20,
                total: new Decimal(70.00),
                produto: {
                    cod: 2,
                    nome: 'Produto 2',
                    marca: 'Marca 2',
                    preco: new Decimal(3.50),
                    quantidade: 23,
                    fornecedor: 'Fornecedor 2'
                }
            }
        ]))


        produtosMock.readManyProducts.mockImplementationOnce(() => Promise.resolve([
            {
                cod: 1,
                nome: 'Produto 1',
                preco: new Decimal(12.99),
                quantidade: 44,
            },
            {
                cod: 2,
                nome: 'Produto 2',
                preco: new Decimal(3.50),
                quantidade: 43,
            },
            {
                cod: 3,
                nome: 'Produto 3',
                preco: new Decimal(50.35),
                quantidade: 78,
            }
        ]))
       
        prismaMock.vendas.update.mockImplementationOnce(() => Promise.resolve( {
            cod: 3,
            cliente_id: 2,
            data: new Date('2025-01-01 05:30:30'),
            formaPgto: 'PIX' as FormasPagamento ,
        }))

        const resposta = await service.updateSale(3, {
            cliente_id: 2,
            data: new Date('2025-01-01 05:30:30'),
            formaPgto: 'PIX' as FormasPagamento ,
            itens: [
                {
                    produto_id: 1,
                    quantidade: 3
                },
                {
                    produto_id: 2,
                    quantidade: 20
                },
                {
                    produto_id: 3,
                    quantidade: 3
                }
            ]
            });
        expect(resposta).toEqual([]);
        
        expect(readSaleSpy).toHaveBeenCalledTimes(1);
        expect(readSaleSpy).toHaveBeenCalledWith(3, expect.objectContaining({
            $transaction: expect.any(Function)
        }));
        
        expect(prismaMock.vendas.update).toHaveBeenCalledTimes(1);
        expect(prismaMock.vendas.update).toHaveBeenCalledWith({
            where:{
                cod: 3
            },
            data:{
                cliente_id: 2,
                data: new Date('2025-01-01 05:30:30'),
                formaPgto: 'PIX' as FormasPagamento
            }
        });

        expect(prismaMock.itensVenda.findMany).toHaveBeenCalledTimes(1)
        expect(prismaMock.itensVenda.findMany).toHaveBeenCalledWith({
            where:{
                venda_id: 3
            },
            include: {
                produto: true
            }
        })


        expect(produtosMock.updateProduct).toHaveBeenCalledTimes(5);

        expect(produtosMock.updateProduct).toHaveBeenCalledWith(1, {
                cod: 1,
                nome: 'Produto 1',
                marca: 'Marca 1',
                preco: new Decimal(12.99),
                quantidade: 44,
                fornecedor: 'Fornecedor 1'
            },
            expect.objectContaining({
                $transaction: expect.any(Function)
        }))

        expect(produtosMock.updateProduct).toHaveBeenCalledWith(2, {
            cod: 2,
            nome: 'Produto 2',
            marca: 'Marca 2',
            preco: new Decimal(3.50),
            quantidade: 43,
            fornecedor: 'Fornecedor 2'
        },
        expect.objectContaining({
            $transaction: expect.any(Function)
        }))

        expect(produtosMock.updateProduct).toHaveBeenCalledWith(1, {
            cod: 1,
            nome: 'Produto 1',
            preco: new Decimal(12.99),
            quantidade: 41
        },
        expect.objectContaining({
            $transaction: expect.any(Function)
        }))

        expect(produtosMock.updateProduct).toHaveBeenCalledWith(2, {
            cod: 2,
            nome: 'Produto 2',
            preco: new Decimal(3.50),
            quantidade: 23
        },
        expect.objectContaining({
            $transaction: expect.any(Function)
        }))

        expect(produtosMock.updateProduct).toHaveBeenCalledWith(3, {
            cod: 3,
            nome: 'Produto 3',
            preco: new Decimal(50.35),
            quantidade: 75,
        },
        expect.objectContaining({
            $transaction: expect.any(Function)
        }))

        expect(produtosMock.readManyProducts).toHaveBeenCalledTimes(1);
        expect(produtosMock.readManyProducts).toHaveBeenCalledWith(expect.arrayContaining([
            {
                produto_id: 1,
                quantidade: 3
            },
            {
                produto_id: 2,
                quantidade: 20
            },
            {
                produto_id: 3,
                quantidade: 3
            },
        ]), expect.objectContaining({
            $transaction: expect.any(Function)
        }) );

        expect(prismaMock.itensVenda.deleteMany).toHaveBeenCalledTimes(1);
        expect(prismaMock.itensVenda.deleteMany).toHaveBeenCalledWith({
            where: {
                venda_id: 3
            }
        });
         
        expect(prismaMock.itensVenda.createMany).toHaveBeenCalledTimes(1);
        expect(prismaMock.itensVenda.createMany).toHaveBeenCalledWith({
            data: [
                {
                    venda_id: 3,
                    produto_id: 1,
                    quantidade: 3,
                    total: 38.97 
                },
                {
                    venda_id: 3,
                    produto_id: 2,
                    quantidade: 20,
                    total: 70.00
                },
                {
                    venda_id: 3,
                    produto_id: 3,
                    quantidade: 3,
                    total: 151.05
                }
            ]
        });

        expect(clienteMock.readClient).toHaveBeenCalledTimes(1);
        expect(clienteMock.readClient).toHaveBeenCalledWith(2, expect.objectContaining({
            $transaction: expect.any(Function)
        }));
    })

    
    it('Atualizar uma venda (deixando item com pouco estoque)', async()=>{
        const readSaleSpy = jest.spyOn(service, 'readSale').mockImplementationOnce(() => Promise.resolve({
            cod: 3,
            cliente_id: 3,
            data: new Date('2025-01-01 05:30:30'),
            formaPgto: 'PIX' as FormasPagamento ,
            totalVenda: 199.90,
            itens: [
                {
                    cod: 4,
                    venda_id: 3,
                    produto_id: 1,
                    quantidade: 10,
                    total: new Decimal(129.90),
                    produto: {
                        cod: 1,
                        nome: 'Produto 1',
                        marca: 'Marca 1',
                        preco: new Decimal(12.99),
                        quantidade: 34,
                        fornecedor: 'Fornecedor 1'
                    }
                },
                {
                    cod: 5,
                    venda_id: 3,
                    produto_id: 2,
                    quantidade: 20,
                    total: new Decimal(70.00),
                    produto: {
                        cod: 2,
                        nome: 'Produto 2',
                        marca: 'Marca 2',
                        preco: new Decimal(3.50),
                        quantidade: 23,
                        fornecedor: 'Fornecedor 2'
                    }
                }
            ],
            cliente: {
                cod: 3,
                nome: 'Cliente 3',
                cpf: '90987654321',
                email: 'cliente3@gmail.com',
                telefone: '19123456789',
                endereco: 'Rua cliente 3',
            }
        }))
        
        prismaMock.itensVenda.findMany.mockImplementationOnce(() => Promise.resolve([
            {
                cod: 4,
                venda_id: 3,
                produto_id: 1,
                quantidade: 10,
                total: new Decimal(129.90),
                produto: {
                    cod: 1,
                    nome: 'Produto 1',
                    marca: 'Marca 1',
                    preco: new Decimal(12.99),
                    quantidade: 34,
                    fornecedor: 'Fornecedor 1'
                }
            },
            {
                cod: 5,
                venda_id: 3,
                produto_id: 2,
                quantidade: 20,
                total: new Decimal(70.00),
                produto: {
                    cod: 2,
                    nome: 'Produto 2',
                    marca: 'Marca 2',
                    preco: new Decimal(3.50),
                    quantidade: 23,
                    fornecedor: 'Fornecedor 2'
                }
            }
        ]))

        produtosMock.readManyProducts.mockImplementationOnce(() => Promise.resolve([
            {
                cod: 1,
                nome: 'Produto 1',
                preco: new Decimal(12.99),
                quantidade: 44,
            },
            {
                cod: 2,
                nome: 'Produto 2',
                preco: new Decimal(3.50),
                quantidade: 43,
            },
            {
                cod: 3,
                nome: 'Produto 3',
                preco: new Decimal(50.35),
                quantidade: 78,
            }
        ]))

        prismaMock.vendas.update.mockImplementationOnce(() => Promise.resolve({
            cod: 3,
            cliente_id: 2,
            data: new Date('2025-01-01 05:30:30'),
            formaPgto: 'PIX' as FormasPagamento ,
        }))

        const resposta = await service.updateSale(3, {
            cliente_id: 2,
            data: new Date('2025-01-01 05:30:30'),
            formaPgto: 'PIX' as FormasPagamento ,
            itens: [
                {
                    produto_id: 1,
                    quantidade: 40
                },
                {
                    produto_id: 2,
                    quantidade: 40
                },
                {
                    produto_id: 3,
                    quantidade: 3
                }
            ]
            });
        expect(resposta).toEqual([{produto: 'Produto 1', quantidade: 4}, {produto: 'Produto 2', quantidade: 3}]);
        
        expect(readSaleSpy).toHaveBeenCalledTimes(1);
        expect(readSaleSpy).toHaveBeenCalledWith(3, expect.objectContaining({
            $transaction: expect.any(Function)
        }));
        
        expect(prismaMock.vendas.update).toHaveBeenCalledTimes(1);
        expect(prismaMock.vendas.update).toHaveBeenCalledWith({
            where:{
                cod: 3
            },
            data:{
                cliente_id: 2,
                data: new Date('2025-01-01 05:30:30'),
                formaPgto: 'PIX' as FormasPagamento
            }
        });

        expect(prismaMock.itensVenda.findMany).toHaveBeenCalledTimes(1)
        expect(prismaMock.itensVenda.findMany).toHaveBeenCalledWith({
            where:{
                venda_id: 3
            },
            include: {
                produto: true
            }
        })


        expect(produtosMock.updateProduct).toHaveBeenCalledTimes(5);

        expect(produtosMock.updateProduct).toHaveBeenCalledWith(1, {
                cod: 1,
                nome: 'Produto 1',
                marca: 'Marca 1',
                preco: new Decimal(12.99),
                quantidade: 44,
                fornecedor: 'Fornecedor 1'
            },
            expect.objectContaining({
                $transaction: expect.any(Function)
        }))

        expect(produtosMock.updateProduct).toHaveBeenCalledWith(2, {
            cod: 2,
            nome: 'Produto 2',
            marca: 'Marca 2',
            preco: new Decimal(3.50),
            quantidade: 43,
            fornecedor: 'Fornecedor 2'
        },
        expect.objectContaining({
            $transaction: expect.any(Function)
        }))

        expect(produtosMock.updateProduct).toHaveBeenCalledWith(1, {
            cod: 1,
            nome: 'Produto 1',
            preco: new Decimal(12.99),
            quantidade: 4
        },
        expect.objectContaining({
            $transaction: expect.any(Function)
        }))

        expect(produtosMock.updateProduct).toHaveBeenCalledWith(2, {
            cod: 2,
            nome: 'Produto 2',
            preco: new Decimal(3.50),
            quantidade: 3
        },
        expect.objectContaining({
            $transaction: expect.any(Function)
        }))

        expect(produtosMock.updateProduct).toHaveBeenCalledWith(3, {
            cod: 3,
            nome: 'Produto 3',
            preco: new Decimal(50.35),
            quantidade: 75,
        },
        expect.objectContaining({
            $transaction: expect.any(Function)
        }))

        expect(produtosMock.readManyProducts).toHaveBeenCalledTimes(1);
        expect(produtosMock.readManyProducts).toHaveBeenCalledWith(expect.arrayContaining([
            {
                produto_id: 1,
                quantidade: 40
            },
            {
                produto_id: 2,
                quantidade: 40
            },
            {
                produto_id: 3,
                quantidade: 3
            },
        ]), expect.objectContaining({
            $transaction: expect.any(Function)
        }) );

        expect(prismaMock.itensVenda.deleteMany).toHaveBeenCalledTimes(1);
        expect(prismaMock.itensVenda.deleteMany).toHaveBeenCalledWith({
            where: {
                venda_id: 3
            }
        });
         
        expect(prismaMock.itensVenda.createMany).toHaveBeenCalledTimes(1);
        expect(prismaMock.itensVenda.createMany).toHaveBeenCalledWith({
            data: [
                {
                    venda_id: 3,
                    produto_id: 1,
                    quantidade: 40,
                    total: 519.60 
                },
                {
                    venda_id: 3,
                    produto_id: 2,
                    quantidade: 40,
                    total: 140.00
                },
                {
                    venda_id: 3,
                    produto_id: 3,
                    quantidade: 3,
                    total: 151.05
                }
            ]
        });

        expect(clienteMock.readClient).toHaveBeenCalledTimes(1);
        expect(clienteMock.readClient).toHaveBeenCalledWith(2, expect.objectContaining({
            $transaction: expect.any(Function)
        }));
    })
    

    it('Atualizar uma venda (item sem estoque)', async()=>{
        const readSaleSpy = jest.spyOn(service, 'readSale').mockImplementationOnce(() => Promise.resolve({
            cod: 3,
            cliente_id: 3,
            data: new Date('2025-01-01 05:30:30'),
            formaPgto: 'PIX' as FormasPagamento ,
            totalVenda: 199.90,
            itens: [
                {
                    cod: 4,
                    venda_id: 3,
                    produto_id: 1,
                    quantidade: 10,
                    total: new Decimal(129.90),
                    produto: {
                        cod: 1,
                        nome: 'Produto 1',
                        marca: 'Marca 1',
                        preco: new Decimal(12.99),
                        quantidade: 34,
                        fornecedor: 'Fornecedor 1'
                    }
                },
                {
                    cod: 5,
                    venda_id: 3,
                    produto_id: 2,
                    quantidade: 20,
                    total: new Decimal(70.00),
                    produto: {
                        cod: 2,
                        nome: 'Produto 2',
                        marca: 'Marca 2',
                        preco: new Decimal(3.50),
                        quantidade: 23,
                        fornecedor: 'Fornecedor 2'
                    }
                }
            ],
            cliente: {
                cod: 3,
                nome: 'Cliente 3',
                cpf: '90987654321',
                email: 'cliente3@gmail.com',
                telefone: '19123456789',
                endereco: 'Rua cliente 3',
            }
        }))
        
        prismaMock.itensVenda.findMany.mockImplementationOnce(() => Promise.resolve([
            {
                cod: 4,
                venda_id: 3,
                produto_id: 1,
                quantidade: 10,
                total: new Decimal(129.90),
                produto: {
                    cod: 1,
                    nome: 'Produto 1',
                    marca: 'Marca 1',
                    preco: new Decimal(12.99),
                    quantidade: 34,
                    fornecedor: 'Fornecedor 1'
                }
            },
            {
                cod: 5,
                venda_id: 3,
                produto_id: 2,
                quantidade: 20,
                total: new Decimal(70),
                produto: {
                    cod: 2,
                    nome: 'Produto 2',
                    marca: 'Marca 2',
                    preco: new Decimal(3.50),
                    quantidade: 23,
                    fornecedor: 'Fornecedor 2'
                }
            }
        ]))

        produtosMock.readManyProducts.mockImplementationOnce(() => Promise.resolve([
            {
                cod: 1,
                nome: 'Produto 1',
                preco: new Decimal(12.99),
                quantidade: 44,
            },
            {
                cod: 2,
                nome: 'Produto 2',
                preco: new Decimal(3.50),
                quantidade: 43,
            },
            {
                cod: 3,
                nome: 'Produto 3',
                preco: new Decimal(50.35),
                quantidade: 78,
            }
        ]))

        prismaMock.vendas.update.mockImplementationOnce(() => Promise.resolve( {
            cod: 3,
            cliente_id: 2,
            data: new Date('2025-01-01 05:30:30'),
            formaPgto: 'PIX' as FormasPagamento ,
        }))

        await expect(service.updateSale(3, {
            cliente_id: 2,
            data: new Date('2025-01-01 05:30:30'),
            formaPgto: 'PIX' as FormasPagamento ,
            itens: [
                {
                    produto_id: 1,
                    quantidade: 3
                },
                {
                    produto_id: 2,
                    quantidade: 44
                },
                {
                    produto_id: 3,
                    quantidade: 3
                }
            ]
            })
        ).rejects.toThrow(new HttpException('Não há quantidade suficiente do produto Produto 2', 409))
        
        expect(readSaleSpy).toHaveBeenCalledTimes(1);
        expect(readSaleSpy).toHaveBeenCalledWith(3, expect.objectContaining({
            $transaction: expect.any(Function)
        }));
        
        expect(prismaMock.vendas.update).toHaveBeenCalledTimes(1);
        expect(prismaMock.vendas.update).toHaveBeenCalledWith({
            where:{
                cod: 3
            },
            data:{
                cliente_id: 2,
                data: new Date('2025-01-01 05:30:30'),
                formaPgto: 'PIX' as FormasPagamento
            }
        });

        expect(prismaMock.itensVenda.findMany).toHaveBeenCalledTimes(1)
        expect(prismaMock.itensVenda.findMany).toHaveBeenCalledWith({
            where:{
                venda_id: 3
            },
            include: {
                produto: true
            }
        })


        expect(produtosMock.updateProduct).toHaveBeenCalledTimes(3);

        expect(produtosMock.updateProduct).toHaveBeenCalledWith(1, {
                cod: 1,
                nome: 'Produto 1',
                marca: 'Marca 1',
                preco: new Decimal(12.99),
                quantidade: 44,
                fornecedor: 'Fornecedor 1'
            },
            expect.objectContaining({
                $transaction: expect.any(Function)
        }))

        expect(produtosMock.updateProduct).toHaveBeenCalledWith(2, {
            cod: 2,
            nome: 'Produto 2',
            marca: 'Marca 2',
            preco: new Decimal(3.50),
            quantidade: 43,
            fornecedor: 'Fornecedor 2'
        },
        expect.objectContaining({
            $transaction: expect.any(Function)
        }))

        expect(produtosMock.updateProduct).toHaveBeenCalledWith(1, {
            cod: 1,
            nome: 'Produto 1',
            preco: new Decimal(12.99),
            quantidade: 41
        },
        expect.objectContaining({
            $transaction: expect.any(Function)
        }))

        expect(produtosMock.readManyProducts).toHaveBeenCalledTimes(1);
        expect(produtosMock.readManyProducts).toHaveBeenCalledWith(expect.arrayContaining([
            {
                produto_id: 1,
                quantidade: 3
            },
            {
                produto_id: 2,
                quantidade: 44
            },
            {
                produto_id: 3,
                quantidade: 3
            },
        ]), expect.objectContaining({
            $transaction: expect.any(Function)
        }) );

        expect(prismaMock.itensVenda.deleteMany).toHaveBeenCalledTimes(1);
        expect(prismaMock.itensVenda.deleteMany).toHaveBeenCalledWith({
            where: {
                venda_id: 3
            }
        });
         
        expect(prismaMock.itensVenda.createMany).toHaveBeenCalledTimes(0);

        expect(clienteMock.readClient).toHaveBeenCalledTimes(1);
        expect(clienteMock.readClient).toHaveBeenCalledWith(2, expect.objectContaining({
            $transaction: expect.any(Function)
        }));
    }) 
        
    it('Atualizar uma venda (venda inexistente)', async()=>{
        const readSaleSpy = jest.spyOn(service, 'readSale').mockRejectedValueOnce(
            new HttpException('A venda não foi encontrada', HttpStatus.NOT_FOUND)
        )

        await expect(service.updateSale(10, {
            cliente_id: 2,
            data: new Date('2024-03-05 13:50:00'),
            formaPgto: 'CREDITO' as FormasPagamento,
            itens: [
                {
                    produto_id: 1,
                    quantidade: 5
                },
                {
                    produto_id: 2,
                    quantidade: 100
                }
            ]
        })
    ).rejects.toThrow(new HttpException('A venda não foi encontrada', 404))

    expect(readSaleSpy).toHaveBeenCalledTimes(1);
    expect(readSaleSpy).toHaveBeenCalledWith(10, expect.objectContaining({
        $transaction: expect.any(Function)
    }));
    expect(prismaMock.vendas.update).toHaveBeenCalledTimes(0);
    expect(prismaMock.itensVenda.findMany).toHaveBeenCalledTimes(0)
    expect(produtosMock.updateProduct).toHaveBeenCalledTimes(0);
    expect(produtosMock.readManyProducts).toHaveBeenCalledTimes(0);
    expect(prismaMock.itensVenda.deleteMany).toHaveBeenCalledTimes(0);
    expect(prismaMock.itensVenda.createMany).toHaveBeenCalledTimes(0);
    expect(clienteMock.readClient).toHaveBeenCalledTimes(1);
    expect(clienteMock.readClient).toHaveBeenCalledWith(2, expect.objectContaining({
        $transaction: expect.any(Function)
    }));
    })

    
    it('Atualizar uma venda (item inexistente)', async()=>{
        const readSaleSpy = jest.spyOn(service, 'readSale').mockImplementationOnce(() => Promise.resolve({
            cod: 3,
            cliente_id: 3,
            data: new Date('2025-01-01 05:30:30'),
            formaPgto: 'PIX' as FormasPagamento ,
            totalVenda: 199.90,
            itens: [
                {
                    cod: 4,
                    venda_id: 3,
                    produto_id: 1,
                    quantidade: 10,
                    total: new Decimal(129.90),
                    produto: {
                        cod: 1,
                        nome: 'Produto 1',
                        marca: 'Marca 1',
                        preco: new Decimal(12.99),
                        quantidade: 34,
                        fornecedor: 'Fornecedor 1'
                    }
                },
                {
                    cod: 5,
                    venda_id: 3,
                    produto_id: 2,
                    quantidade: 20,
                    total: new Decimal(70.00),
                    produto: {
                        cod: 2,
                        nome: 'Produto 2',
                        marca: 'Marca 2',
                        preco: new Decimal(3.50),
                        quantidade: 23,
                        fornecedor: 'Fornecedor 2'
                    }
                }
            ],
            cliente: {
                cod: 3,
                nome: 'Cliente 3',
                cpf: '90987654321',
                email: 'cliente3@gmail.com',
                telefone: '19123456789',
                endereco: 'Rua cliente 3',
            }
        }))

        prismaMock.itensVenda.findMany.mockImplementationOnce(() => Promise.resolve([
            {
                cod: 4,
                venda_id: 3,
                produto_id: 1,
                quantidade: 10,
                total: new Decimal(129.90),
                produto: {
                    cod: 1,
                    nome: 'Produto 1',
                    marca: 'Marca 1',
                    preco: new Decimal(12.99),
                    quantidade: 34,
                    fornecedor: 'Fornecedor 1'
                }
            },
            {
                cod: 5,
                venda_id: 3,
                produto_id: 2,
                quantidade: 20,
                total: new Decimal(70),
                produto: {
                    cod: 2,
                    nome: 'Produto 2',
                    marca: 'Marca 2',
                    preco: new Decimal(3.50),
                    quantidade: 23,
                    fornecedor: 'Fornecedor 2'
                }
            }
        ]))

        produtosMock.readManyProducts.mockImplementationOnce(() => Promise.resolve([
            {
                cod: 1,
                nome: 'Produto 1',
                preco: new Decimal(12.99),
                quantidade: 44,
            },
            {
                cod: 2,
                nome: 'Produto 2',
                preco: new Decimal(3.50),
                quantidade: 43,
            }
        ]))

        prismaMock.vendas.update.mockImplementationOnce(() => Promise.resolve({
            cod: 3,
            cliente_id: 2,
            data: new Date('2025-01-01 05:30:30'),
            formaPgto: 'PIX' as FormasPagamento ,
        }))

        await expect(service.updateSale(3, {
            cliente_id: 2,
            data: new Date('2025-01-01 05:30:30'),
            formaPgto: 'PIX' as FormasPagamento ,
            itens: [
                {
                    produto_id: 1,
                    quantidade: 3
                },
                {
                    produto_id: 2,
                    quantidade: 20
                },
                {
                    produto_id: 5,
                    quantidade: 3
                }
            ]
            })
        ).rejects.toThrow(new HttpException('O produto 5 não foi encontrado na base de dados', 404))
        
        expect(readSaleSpy).toHaveBeenCalledTimes(1);
        expect(readSaleSpy).toHaveBeenCalledWith(3, expect.objectContaining({
            $transaction: expect.any(Function)
        }));
        
        expect(prismaMock.vendas.update).toHaveBeenCalledTimes(1);
        expect(prismaMock.vendas.update).toHaveBeenCalledWith({
            where:{
                cod: 3
            },
            data:{
                cliente_id: 2,
                data: new Date('2025-01-01 05:30:30'),
                formaPgto: 'PIX' as FormasPagamento
            }
        });

        expect(prismaMock.itensVenda.findMany).toHaveBeenCalledTimes(1)
        expect(prismaMock.itensVenda.findMany).toHaveBeenCalledWith({
            where:{
                venda_id: 3
            },
            include: {
                produto: true
            }
        })


        expect(produtosMock.updateProduct).toHaveBeenCalledTimes(4);

        expect(produtosMock.updateProduct).toHaveBeenCalledWith(1, {
                cod: 1,
                nome: 'Produto 1',
                marca: 'Marca 1',
                preco: new Decimal(12.99),
                quantidade: 44,
                fornecedor: 'Fornecedor 1'
            },
            expect.objectContaining({
                $transaction: expect.any(Function)
        }))

        expect(produtosMock.updateProduct).toHaveBeenCalledWith(2, {
            cod: 2,
            nome: 'Produto 2',
            marca: 'Marca 2',
            preco: new Decimal(3.50),
            quantidade: 43,
            fornecedor: 'Fornecedor 2'
        },
        expect.objectContaining({
            $transaction: expect.any(Function)
        }))

        expect(produtosMock.updateProduct).toHaveBeenCalledWith(1, {
            cod: 1,
            nome: 'Produto 1',
            preco: new Decimal(12.99),
            quantidade: 41
        },
        expect.objectContaining({
            $transaction: expect.any(Function)
        }))

        expect(produtosMock.updateProduct).toHaveBeenCalledWith(2, {
            cod: 2,
            nome: 'Produto 2',
            preco: new Decimal(3.50),
            quantidade: 23
        },
        expect.objectContaining({
            $transaction: expect.any(Function)
        }))

        expect(produtosMock.readManyProducts).toHaveBeenCalledTimes(1);
        expect(produtosMock.readManyProducts).toHaveBeenCalledWith(expect.arrayContaining([
            {
                produto_id: 1,
                quantidade: 3
            },
            {
                produto_id: 2,
                quantidade: 20
            },
            {
                produto_id: 5,
                quantidade: 3
            },
        ]), expect.objectContaining({
            $transaction: expect.any(Function)
        }) );

        expect(prismaMock.itensVenda.deleteMany).toHaveBeenCalledTimes(1);
        expect(prismaMock.itensVenda.deleteMany).toHaveBeenCalledWith({
            where: {
                venda_id: 3
            }
        });
         
        expect(prismaMock.itensVenda.createMany).toHaveBeenCalledTimes(0);
        expect(clienteMock.readClient).toHaveBeenCalledTimes(1);
        expect(clienteMock.readClient).toHaveBeenCalledWith(2, expect.objectContaining({
            $transaction: expect.any(Function)
        }));
    })

    it('Atualizar uma venda (item repetido)', async()=>{
        prismaMock.itensVenda.createMany.mockRejectedValueOnce({
            code: 'P2002',
            message: 'itensVenda'
        })

        const readSaleSpy = jest.spyOn(service, 'readSale').mockImplementationOnce(() => Promise.resolve({
            cod: 3,
            cliente_id: 3,
            data: new Date('2025-01-01 05:30:30'),
            formaPgto: 'PIX' as FormasPagamento ,
            totalVenda: 199.90,
            itens: [
                {
                    cod: 4,
                    venda_id: 3,
                    produto_id: 1,
                    quantidade: 10,
                    total: new Decimal(129.90),
                    produto: {
                        cod: 1,
                        nome: 'Produto 1',
                        marca: 'Marca 1',
                        preco: new Decimal(12.99),
                        quantidade: 34,
                        fornecedor: 'Fornecedor 1'
                    }
                },
                {
                    cod: 5,
                    venda_id: 3,
                    produto_id: 2,
                    quantidade: 20,
                    total: new Decimal(70.00),
                    produto: {
                        cod: 2,
                        nome: 'Produto 2',
                        marca: 'Marca 2',
                        preco: new Decimal(3.50),
                        quantidade: 23,
                        fornecedor: 'Fornecedor 2'
                    }
                }
            ],
            cliente: {
                cod: 3,
                nome: 'Cliente 3',
                cpf: '90987654321',
                email: 'cliente3@gmail.com',
                telefone: '19123456789',
                endereco: 'Rua cliente 3',
            }
        }))

        
        prismaMock.itensVenda.findMany.mockImplementationOnce(() => Promise.resolve([
            {
                cod: 4,
                venda_id: 3,
                produto_id: 1,
                quantidade: 10,
                total: new Decimal(129.90),
                produto: {
                    cod: 1,
                    nome: 'Produto 1',
                    marca: 'Marca 1',
                    preco: new Decimal(12.99),
                    quantidade: 34,
                    fornecedor: 'Fornecedor 1'
                }
            },
            {
                cod: 5,
                venda_id: 3,
                produto_id: 2,
                quantidade: 20,
                total: new Decimal(70),
                produto: {
                    cod: 2,
                    nome: 'Produto 2',
                    marca: 'Marca 2',
                    preco: new Decimal(3.50),
                    quantidade: 23,
                    fornecedor: 'Fornecedor 2'
                }
            }
        ]))

        produtosMock.readManyProducts.mockImplementationOnce(() => Promise.resolve([
            {
                cod: 1,
                nome: 'Produto 1',
                preco: new Decimal(12.99),
                quantidade: 44,
            },
            {
                cod: 2,
                nome: 'Produto 2',
                preco: new Decimal(3.50),
                quantidade: 43,
            },
            {
                cod: 1,
                nome: 'Produto 1',
                preco: new Decimal(12.99),
                quantidade: 44,
            }
        ]))
        prismaMock.vendas.update.mockImplementationOnce(() => Promise.resolve( {
            cod: 3,
            cliente_id: 2,
            data: new Date('2025-01-01 05:30:30'),
            formaPgto: 'PIX' as FormasPagamento ,
        }))

        await expect(service.updateSale(3, {
            cliente_id: 2,
            data: new Date('2025-01-01 05:30:30'),
            formaPgto: 'PIX' as FormasPagamento ,
            itens: [
                {
                    produto_id: 1,
                    quantidade: 3
                },
                {
                    produto_id: 2,
                    quantidade: 20
                },
                {
                    produto_id: 1,
                    quantidade: 3
                }
            ]
            })
        ).rejects.toThrow(new HttpException('Há um produto repetido na venda', 409))
        
        expect(readSaleSpy).toHaveBeenCalledTimes(1);
        expect(readSaleSpy).toHaveBeenCalledWith(3, expect.objectContaining({
            $transaction: expect.any(Function)
        }));
        
        expect(prismaMock.vendas.update).toHaveBeenCalledTimes(1);
        expect(prismaMock.vendas.update).toHaveBeenCalledWith({
            where:{
                cod: 3
            },
            data:{
                cliente_id: 2,
                data: new Date('2025-01-01 05:30:30'),
                formaPgto: 'PIX' as FormasPagamento
            }
        });

        expect(prismaMock.itensVenda.findMany).toHaveBeenCalledTimes(1)
        expect(prismaMock.itensVenda.findMany).toHaveBeenCalledWith({
            where:{
                venda_id: 3
            },
            include: {
                produto: true
            }
        })


        expect(produtosMock.updateProduct).toHaveBeenCalledTimes(5);

        expect(produtosMock.updateProduct).toHaveBeenCalledWith(1, {
                cod: 1,
                nome: 'Produto 1',
                marca: 'Marca 1',
                preco: new Decimal(12.99),
                quantidade: 44,
                fornecedor: 'Fornecedor 1'
            },
            expect.objectContaining({
                $transaction: expect.any(Function)
        }))

        expect(produtosMock.updateProduct).toHaveBeenCalledWith(2, {
            cod: 2,
            nome: 'Produto 2',
            marca: 'Marca 2',
            preco: new Decimal(3.50),
            quantidade: 43,
            fornecedor: 'Fornecedor 2'
        },
        expect.objectContaining({
            $transaction: expect.any(Function)
        }))

        expect(produtosMock.updateProduct).toHaveBeenCalledWith(1, {
            cod: 1,
            nome: 'Produto 1',
            preco: new Decimal(12.99),
            quantidade: 41
        },
        expect.objectContaining({
            $transaction: expect.any(Function)
        }))

        expect(produtosMock.updateProduct).toHaveBeenCalledWith(2, {
            cod: 2,
            nome: 'Produto 2',
            preco: new Decimal(3.50),
            quantidade: 23
        },
        expect.objectContaining({
            $transaction: expect.any(Function)
        }))

        expect(produtosMock.updateProduct).toHaveBeenCalledWith(1, {
            cod: 1,
            nome: 'Produto 1',
            preco: new Decimal(12.99),
            quantidade: 38
        },
        expect.objectContaining({
            $transaction: expect.any(Function)
        }))


        expect(produtosMock.readManyProducts).toHaveBeenCalledTimes(1);
        expect(produtosMock.readManyProducts).toHaveBeenCalledWith(expect.arrayContaining([
            {
                produto_id: 1,
                quantidade: 3
            },
            {
                produto_id: 2,
                quantidade: 20
            },
            {
                produto_id: 1,
                quantidade: 3
            },
        ]), expect.objectContaining({
            $transaction: expect.any(Function)
        }) );

        expect(prismaMock.itensVenda.deleteMany).toHaveBeenCalledTimes(1);
        expect(prismaMock.itensVenda.deleteMany).toHaveBeenCalledWith({
            where: {
                venda_id: 3
            }
        });
         
        expect(prismaMock.itensVenda.createMany).toHaveBeenCalledTimes(1);

        expect(clienteMock.readClient).toHaveBeenCalledTimes(1);
        expect(clienteMock.readClient).toHaveBeenCalledWith(2, expect.objectContaining({
            $transaction: expect.any(Function)
        }));
    })

    it('Atualizar uma venda (sem itens)', async()=>{
        const readSaleSpy = jest.spyOn(service, 'readSale').mockImplementationOnce(() => Promise.resolve({
            cod: 3,
            cliente_id: 3,
            data: new Date('2025-01-01 05:30:30'),
            formaPgto: 'PIX' as FormasPagamento,
            totalVenda: 199.90,
            itens: [
                {
                    cod: 4,
                    venda_id: 3,
                    produto_id: 1,
                    quantidade: 10,
                    total: new Decimal(129.90),
                    produto: {
                        cod: 1,
                        nome: 'Produto 1',
                        marca: 'Marca 1',
                        preco: new Decimal(12.99),
                        quantidade: 34,
                        fornecedor: 'Fornecedor 1'
                    }
                },
                {
                    cod: 5,
                    venda_id: 3,
                    produto_id: 2,
                    quantidade: 20,
                    total: new Decimal(70.00),
                    produto: {
                        cod: 2,
                        nome: 'Produto 2',
                        marca: 'Marca 2',
                        preco: new Decimal(3.50),
                        quantidade: 23,
                        fornecedor: 'Fornecedor 2'
                    }
                }
            ],
            cliente: {
                cod: 3,
                nome: 'Cliente 3',
                cpf: '90987654321',
                email: 'cliente3@gmail.com',
                telefone: '19123456789',
                endereco: 'Rua cliente 3',
            }
        }))
        
        prismaMock.itensVenda.findMany.mockImplementationOnce(() => Promise.resolve([
            {
                cod: 4,
                venda_id: 3,
                produto_id: 1,
                quantidade: 10,
                total: new Decimal(129.90),
                produto: {
                    cod: 1,
                    nome: 'Produto 1',
                    marca: 'Marca 1',
                    preco: new Decimal(12.99),
                    quantidade: 34,
                    fornecedor: 'Fornecedor 1'
                }
            },
            {
                cod: 5,
                venda_id: 3,
                produto_id: 2,
                quantidade: 20,
                total: new Decimal(70),
                produto: {
                    cod: 2,
                    nome: 'Produto 2',
                    marca: 'Marca 2',
                    preco: new Decimal(3.50),
                    quantidade: 23,
                    fornecedor: 'Fornecedor 2'
                }
            }
        ]))

        prismaMock.vendas.update.mockImplementationOnce(() => Promise.resolve({
            cod: 3,
            cliente_id: 2,
            data: new Date('2025-01-30 05:30:30'),
            formaPgto: 'DEBITO' as FormasPagamento ,
        }))

        const resposta = await service.updateSale(3,{
            cliente_id: 2,
            data: new Date('2025-01-30 05:30:30'),
            formaPgto: 'DEBITO' as FormasPagamento,
            itens: []
        });
        expect(resposta).toEqual(
            []
        );
        
        expect(readSaleSpy).toHaveBeenCalledTimes(1);
        expect(readSaleSpy).toHaveBeenCalledWith(3, expect.objectContaining({
            $transaction: expect.any(Function)
        }));
        
        expect(prismaMock.vendas.update).toHaveBeenCalledTimes(1);
        expect(prismaMock.vendas.update).toHaveBeenCalledWith({
            where:{
                cod: 3
            },
            data:{
                cliente_id: 2,
                data: new Date('2025-01-30 05:30:30'),
                formaPgto: 'DEBITO' as FormasPagamento
            }
        });

        expect(prismaMock.itensVenda.findMany).toHaveBeenCalledTimes(1)
        expect(prismaMock.itensVenda.findMany).toHaveBeenCalledWith({
            where:{
                venda_id: 3
            },
            include: {
                produto: true
            }
        })


        expect(produtosMock.updateProduct).toHaveBeenCalledTimes(2);

        expect(produtosMock.updateProduct).toHaveBeenCalledWith(1, {
                cod: 1,
                nome: 'Produto 1',
                marca: 'Marca 1',
                preco: new Decimal(12.99),
                quantidade: 44,
                fornecedor: 'Fornecedor 1'
            },
            expect.objectContaining({
                $transaction: expect.any(Function)
        }))

        expect(produtosMock.updateProduct).toHaveBeenCalledWith(2, {
            cod: 2,
            nome: 'Produto 2',
            marca: 'Marca 2',
            preco: new Decimal(3.50),
            quantidade: 43,
            fornecedor: 'Fornecedor 2'
        },
        expect.objectContaining({
            $transaction: expect.any(Function)
        }))


        expect(prismaMock.itensVenda.deleteMany).toHaveBeenCalledTimes(1);
        expect(prismaMock.itensVenda.deleteMany).toHaveBeenCalledWith({
            where: {
                venda_id: 3
            }
        });
         
        expect(prismaMock.itensVenda.createMany).toHaveBeenCalledTimes(0);

        expect(clienteMock.readClient).toHaveBeenCalledTimes(1);
        expect(clienteMock.readClient).toHaveBeenCalledWith(2, expect.objectContaining({
            $transaction: expect.any(Function)
        }));
    })


    it('Atualizar uma venda (cliente inexistente)', async()=>{
        clienteMock.readClient.mockRejectedValueOnce(
                    new HttpException('O cliente não foi encontrado', HttpStatus.NOT_FOUND)
        )
        const readSaleSpy = jest.spyOn(service, 'readSale')
        
        
        await expect(service.updateSale(3, {
            cliente_id: 2,
            data: new Date('2025-01-01 05:30:30'),
            formaPgto: 'PIX' as FormasPagamento ,
            itens: [
                {
                    produto_id: 1,
                    quantidade: 3
                },
                {
                    produto_id: 2,
                    quantidade: 20
                },
                {
                    produto_id: 3,
                    quantidade: 3
                }
            ]
            })).rejects.toThrow(new HttpException('O cliente não foi encontrado', 404))
        
        expect(readSaleSpy).toHaveBeenCalledTimes(0);
        expect(prismaMock.vendas.update).toHaveBeenCalledTimes(0);
        expect(prismaMock.itensVenda.findMany).toHaveBeenCalledTimes(0)
        expect(produtosMock.updateProduct).toHaveBeenCalledTimes(0);
        expect(produtosMock.readManyProducts).toHaveBeenCalledTimes(0);
        expect(prismaMock.itensVenda.deleteMany).toHaveBeenCalledTimes(0);
        expect(prismaMock.itensVenda.createMany).toHaveBeenCalledTimes(0);
        expect(clienteMock.readClient).toHaveBeenCalledTimes(1);
        expect(clienteMock.readClient).toHaveBeenCalledWith(2, expect.objectContaining({
            $transaction: expect.any(Function)
        }));
    })

    
    it('Retorna informações de venda do ano', async()=>{
        prismaMock.vendas.findMany.mockImplementationOnce(() => Promise.resolve(fakeVendasYear))
       
        const resposta = await service.readSalesByYear(2025)
        expect(resposta).toEqual(
            fakeVendasYearEsperado
        );
        expect(prisma.vendas.findMany).toHaveBeenCalledTimes(1);
        expect(prisma.vendas.findMany).toHaveBeenCalledWith({
            include: {
                itens: true
            },
            where: {
                data: {
                    gte: new Date(`2025-01-01T00:00:00.000Z`),
                    lt: new Date(`2026-01-01T00:00:00.000Z`),
                }
            }
        });
    })
})


/*https://dev.to/mrtinsvitor/testes-com-nestjs-e-prisma-24bo*/


