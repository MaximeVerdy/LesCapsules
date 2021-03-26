

import { render, screen } from '@testing-library/react';
import { mount, shallow } from 'enzyme';

import App from './App';
import MentionsLegales from './components/legalterms';

test('render d`une <div />', () => {  
     render(<App />);
    const container = shallow(<Provider />);
    expect(container.find('div').length).toEqual(1);
});

test('le texte est bien dans le composant', () => {
render(<MentionsLegales />);
const textElement = screen.getByText(/ARTICLE 1/i);
expect(textElement).toBeInTheDocument();
});
