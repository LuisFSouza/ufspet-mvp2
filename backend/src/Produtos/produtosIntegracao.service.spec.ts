import { Test } from '@nestjs/testing';
import { ProdutosService } from './produtos.service';
import { PrismaService } from '../Prisma/prisma.service';
import { HttpException, HttpStatus } from '@nestjs/common';
import Decimal from 'decimal.js';

const fakeProductInsertUpdate = {
    nome: 'Produto 1',
    marca: 'Marca 1',
    preco: new Decimal(12.99),
    quantidade:  34,
    fornecedor: 'Fornecedor 1'
}

const fakeProducts = [
    {
        cod: 1,
        nome: 'Produto 1',
        marca: 'Marca 1',
        preco: new Decimal(12.99),
        quantidade: 34,
        fornecedor: 'Fornecedor 1'
    },
    {
        cod: 2,
        nome: 'Produto 2',
        marca: 'Marca 2',
        preco: new Decimal(3.50),
        quantidade: 23,
        fornecedor: 'Fornecedor 2'
    },
    {
        cod: 3,
        nome: 'Produto 3',
        marca: 'Marca 3',
        preco: new Decimal(50.35),
        quantidade: 78,
        fornecedor: 'Fornecedor 3'
    }
]

const prismaMock = {
    $transaction: jest.fn(async (callback) => callback(prismaMock)),
    produtos: {
        create: jest.fn().mockImplementation(() => Promise.resolve(fakeProducts[0])),
        findMany: jest.fn().mockImplementation(() => Promise.resolve(fakeProducts)),
        findUnique: jest.fn().mockImplementation(() => Promise.resolve(fakeProducts[0])),
        update: jest.fn().mockImplementation(() => Promise.resolve(fakeProducts[0])),
        delete: jest.fn().mockImplementation(() => Promise.resolve(fakeProducts[0]))
    }
}

describe('Integração - Serviço de Produtos', () => {
    let service: ProdutosService;
    let prisma: PrismaService;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                ProdutosService,
                {provide: PrismaService, useValue: prismaMock}
            ]
        }).compile()

        service = module.get<ProdutosService>(ProdutosService)
        prisma = module.get<PrismaService>(PrismaService)
    }),
    afterEach(()=>{
        jest.clearAllMocks()
    })

    it('Atualiza um produto específico', async()=>{
        const readProductSpy = jest.spyOn(service, 'readProduct')
        const resposta = await service.updateProduct(1, fakeProductInsertUpdate);
        expect(resposta).toEqual(fakeProducts[0]);
        expect(readProductSpy).toHaveBeenCalledTimes(1);
        expect(readProductSpy).toHaveBeenCalledWith(1, expect.objectContaining({
            $transaction: expect.any(Function)
        }));
        expect(prisma.produtos.update).toHaveBeenCalledTimes(1);
        expect(prisma.produtos.update).toHaveBeenCalledWith({
            where: {cod: 1},
            data: fakeProductInsertUpdate
        });
    })

    it('Atualiza um produto específico (não existente)', async()=>{
        prismaMock.produtos.findUnique.mockImplementationOnce(() => Promise.resolve(null))
        const readProductSpy = jest.spyOn(service, 'readProduct')
        await expect(service.updateProduct(10, fakeProductInsertUpdate)).rejects.toThrow(new HttpException('O produto não foi encontrado', 404))
        expect(readProductSpy).toHaveBeenCalledTimes(1);
        expect(readProductSpy).toHaveBeenCalledWith(10, expect.objectContaining({
            $transaction: expect.any(Function)
        }));
        expect(prisma.produtos.update).toHaveBeenCalledTimes(0);
    })

    it('Deleta um produto específico', async()=>{
        const readProductSpy = jest.spyOn(service, 'readProduct')
        const resposta = await service.deleteProduct(1);
        expect(resposta).toEqual(fakeProducts[0]);
        expect(readProductSpy).toHaveBeenCalledTimes(1);
        expect(readProductSpy).toHaveBeenCalledWith(1, expect.objectContaining({
            $transaction: expect.any(Function)
        }));
        expect(prisma.produtos.delete).toHaveBeenCalledTimes(1);
        expect(prisma.produtos.delete).toHaveBeenCalledWith({
            where: {cod: 1}
        });
    })

    it('Deleta um produto específico (que tem uma venda associada)', async()=>{
        prismaMock.produtos.delete.mockRejectedValueOnce({
            code: 'P2003'
        })
        const readProductSpy = jest.spyOn(service, 'readProduct')
        await expect(service.deleteProduct(1)).rejects.toThrow(new HttpException("Não foi possivel excluir o produto pois ele tem pelo menos uma venda associada", 409))
        expect(readProductSpy).toHaveBeenCalledTimes(1);
        expect(readProductSpy).toHaveBeenCalledWith(1, expect.objectContaining({
            $transaction: expect.any(Function)
        }));
        expect(prisma.produtos.delete).toHaveBeenCalledTimes(1);
        expect(prisma.produtos.delete).toHaveBeenCalledWith({
            where: {cod: 1}
        });
    })


    it('Deleta um produto específico (não existente)', async()=>{
        prismaMock.produtos.findUnique.mockImplementationOnce(() => Promise.resolve(null))
        const readProductSpy = jest.spyOn(service, 'readProduct')
        await expect(service.deleteProduct(10)).rejects.toThrow(new HttpException('O produto não foi encontrado', 404))
        expect(readProductSpy).toHaveBeenCalledTimes(1);
        expect(readProductSpy).toHaveBeenCalledWith(10, expect.objectContaining({
            $transaction: expect.any(Function)
        }));
        expect(prisma.produtos.delete).toHaveBeenCalledTimes(0);
    })
})
/*https://dev.to/mrtinsvitor/testes-com-nestjs-e-prisma-24bo*/


