import { Test } from '@nestjs/testing';
import { PrismaService } from '../Prisma/prisma.service';
import { HttpException, HttpStatus } from '@nestjs/common';
import { ServicosService } from './servicos.service';
import Decimal from 'decimal.js';

const fakeServiceCreateUpdate = {
    nome: 'Nome 1',
    duracao: 30,
    preco: 12.99,
    descricao: 'Descrição 1',
}

const fakeServices = [
    {
        cod: 1,
        nome: 'Nome 1',
        duracao: 30,
        preco: new Decimal(12.99),
        descricao: 'Descrição 1',
    },
    {
        cod: 2,
        nome: 'Nome 2',
        duracao: 50,
        preco: new Decimal(53.65),
        descricao: 'Descrição 2',
    },
    {
        cod: 3,
        nome: 'Nome 3',
        duracao: 25,
        preco: new Decimal(5.00),
        descricao: 'Descrição 3'
    }
]

const prismaMock = {
    $transaction: jest.fn(async (callback) => callback(prismaMock)),
    servicos: {
        create: jest.fn().mockImplementation(() => Promise.resolve(fakeServices[0])),
        findMany: jest.fn().mockImplementation(() => Promise.resolve(fakeServices)),
        findUnique: jest.fn().mockImplementation(() => Promise.resolve(fakeServices[0])),
        update: jest.fn().mockImplementation(() => Promise.resolve(fakeServices[0])),
        delete: jest.fn().mockImplementation(() => Promise.resolve(fakeServices[0]))
    }
}


describe('Serviço de Serviços', () => {
    let service: ServicosService;
    let prisma: PrismaService;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                ServicosService,
                {provide: PrismaService, useValue: prismaMock}
            ]
        }).compile()

        service = module.get<ServicosService>(ServicosService)
        prisma = module.get<PrismaService>(PrismaService)
    }),
    afterEach(()=>{
        jest.clearAllMocks()
    })


    it('Criar um serviço', async()=>{
        const resposta = await service.createService(fakeServiceCreateUpdate);
        expect(resposta).toEqual(fakeServices[0]);
        expect(prisma.servicos.create).toHaveBeenCalledTimes(1);
        expect(prisma.servicos.create).toHaveBeenCalledWith({
            data: fakeServiceCreateUpdate
        });
    })

    it('Criar um serviço (com nome repetido)', async()=>{
        prismaMock.servicos.create.mockRejectedValueOnce({
            code: 'P2002',
            meta: {
                target:['nome']
            }
        })
        await expect(service.createService(fakeServiceCreateUpdate)).rejects.toThrow(new HttpException('Já existe um serviço com este nome', 409))
        expect(prisma.servicos.create).toHaveBeenCalledTimes(1);
        expect(prisma.servicos.create).toHaveBeenCalledWith({
            data: fakeServiceCreateUpdate
        });
    })


    it('Retorna os serviços', async()=>{
        const resposta = await service.readServices();
        expect(resposta).toEqual(fakeServices);
        expect(prisma.servicos.findMany).toHaveBeenCalledTimes(1);
        expect(prisma.servicos.findMany).toHaveBeenCalledWith();
    })

    it('Retorna um serviço específico', async()=>{
        const resposta = await service.readService(1);
        expect(resposta).toEqual(fakeServices[0]);
        expect(prisma.servicos.findUnique).toHaveBeenCalledTimes(1);
        expect(prisma.servicos.findUnique).toHaveBeenCalledWith({
            where: {cod: 1}
        });
    })

    it('Retorna um serviço específico (não existente)', async()=>{
        prismaMock.servicos.findUnique.mockImplementationOnce(() => Promise.resolve(null))
        await expect(service.readService(10)).rejects.toThrow(new HttpException('O serviço não foi encontrado', 404))
        expect(prisma.servicos.findUnique).toHaveBeenCalledTimes(1);
        expect(prisma.servicos.findUnique).toHaveBeenCalledWith({
            where: {cod: 10}
        });
    })

    it('Atualiza um serviço específico', async()=>{
        const readServiceSpy = jest.spyOn(service, 'readService').mockImplementationOnce(() => Promise.resolve(fakeServices[0]))
        const resposta = await service.updateService(1, fakeServiceCreateUpdate);
        expect(resposta).toEqual(fakeServices[0]);
        expect(readServiceSpy).toHaveBeenCalledTimes(1);
        expect(readServiceSpy).toHaveBeenCalledWith(1, expect.objectContaining({
            $transaction: expect.any(Function)
        }));
        expect(prisma.servicos.update).toHaveBeenCalledTimes(1);
        expect(prisma.servicos.update).toHaveBeenCalledWith({
            where: {cod: 1},
            data: fakeServiceCreateUpdate
        });
    })

    it('Atualiza um serviço (com nome repetido)', async()=>{
        prismaMock.servicos.update.mockRejectedValueOnce({
            code: 'P2002',
            meta: {
                target:['nome']
            }
        })
        const readServiceSpy = jest.spyOn(service, 'readService').mockImplementationOnce(() => Promise.resolve(fakeServices[0]))
        await expect(service.updateService(1, fakeServiceCreateUpdate)).rejects.toThrow(new HttpException('Já existe um serviço com este nome', 409))
        expect(readServiceSpy).toHaveBeenCalledTimes(1);
        expect(readServiceSpy).toHaveBeenCalledWith(1, expect.objectContaining({
            $transaction: expect.any(Function)
        }));
        expect(prisma.servicos.update).toHaveBeenCalledTimes(1);
        expect(prisma.servicos.update).toHaveBeenCalledWith({
            where: {cod: 1},
            data: fakeServiceCreateUpdate
        });
    })

    it('Atualiza um serviço específico (não existente)', async()=>{
        const readServiceSpy = jest.spyOn(service, 'readService').mockRejectedValueOnce(
            new HttpException('O serviço não foi encontrado', HttpStatus.NOT_FOUND)
        )
        await expect(service.updateService(10, prismaMock[2])).rejects.toThrow(new HttpException('O serviço não foi encontrado', 404))
        expect(readServiceSpy).toHaveBeenCalledTimes(1);
        expect(readServiceSpy).toHaveBeenCalledWith(10, expect.objectContaining({
            $transaction: expect.any(Function)
        }));
        expect(prisma.servicos.update).toHaveBeenCalledTimes(0);
    })

    it('Deleta um serviço específico', async()=>{
        const readServiceSpy = jest.spyOn(service, 'readService').mockImplementationOnce(() => Promise.resolve(fakeServices[0]))
        const resposta = await service.deleteService(1);
        expect(resposta).toEqual(fakeServices[0]);
        expect(readServiceSpy).toHaveBeenCalledTimes(1);
        expect(readServiceSpy).toHaveBeenCalledWith(1, expect.objectContaining({
            $transaction: expect.any(Function)
        }));
        expect(prisma.servicos.delete).toHaveBeenCalledTimes(1);
        expect(prisma.servicos.delete).toHaveBeenCalledWith({
            where: {cod: 1}
        });
    })

    it('Deleta um serviço específico (que tem um agendamento associado)', async()=>{
        prismaMock.servicos.delete.mockRejectedValueOnce({
            code: 'P2003'
        })
        const readServiceSpy = jest.spyOn(service, 'readService').mockImplementationOnce(() => Promise.resolve(fakeServices[0]))
        await expect(service.deleteService(1)).rejects.toThrow(new HttpException("Não foi possivel excluir o serviço pois ele tem pelo menos um agendamento associado", 409))
        expect(readServiceSpy).toHaveBeenCalledTimes(1);
        expect(readServiceSpy).toHaveBeenCalledWith(1, expect.objectContaining({
            $transaction: expect.any(Function)
        }));
        expect(prisma.servicos.delete).toHaveBeenCalledTimes(1);
        expect(prisma.servicos.delete).toHaveBeenCalledWith({
            where: {cod: 1}
        });
    })

    it('Deleta um serviço específico (não existente)', async()=>{
        const readServiceSpy = jest.spyOn(service, 'readService').mockRejectedValueOnce(
            new HttpException('O serviço não foi encontrado', HttpStatus.NOT_FOUND)
        )
        await expect(service.deleteService(10)).rejects.toThrow(new HttpException('O serviço não foi encontrado', 404))
        expect(readServiceSpy).toHaveBeenCalledTimes(1);
        expect(readServiceSpy).toHaveBeenCalledWith(10, expect.objectContaining({
            $transaction: expect.any(Function)
        }));
        expect(prisma.servicos.delete).toHaveBeenCalledTimes(0);
    })
})
/*https://dev.to/mrtinsvitor/testes-com-nestjs-e-prisma-24bo*/


