import React from 'react';
import { render, screen } from '@testing-library/react';
import Acao from '../components/Acao';

describe('Componente Acao', () => {
    test('Renderiza título e subtítulo corretamente', () => {
        render(<Acao titulo="Teste de Ação" subtitulo="Subtítulo de Teste" campos={[]} botoes={[]} />);
        
        expect(screen.getByText('Teste de Ação')).toBeInTheDocument();
        expect(screen.getByText('Subtítulo de Teste')).toBeInTheDocument();
    });

    test('Renderiza os campos corretamente', () => {
        const campos = [
            { component: <input placeholder="Campo 1" />, buttonSupport: false },
            { component: <input placeholder="Campo 2" />, buttonSupport: true }
        ];
        
        render(<Acao titulo="Teste" subtitulo="Teste de Campos" campos={campos} botoes={[]} />);
        
        expect(screen.getByPlaceholderText('Campo 1')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Campo 2')).toBeInTheDocument();
    });

    test('Renderiza botões corretamente', () => {
        const botoes = [<button key="1">Botão 1</button>, <button key="2">Botão 2</button>];

        render(<Acao titulo="Teste" subtitulo="Teste de Botões" campos={[]} botoes={botoes} />);
        
        expect(screen.getByText('Botão 1')).toBeInTheDocument();
        expect(screen.getByText('Botão 2')).toBeInTheDocument();
    });
});
