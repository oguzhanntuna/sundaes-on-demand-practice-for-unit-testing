import { render, screen } from '../../../test-utils/testing-library-utils';
import userEvent from '@testing-library/user-event';

import Options from '../Options';

test('update scoop subtotal when scoops change', async () => {
    render(<Options optionType="scoops" />);

    // make sure total start out $0.00
    const scoopSubtotal = screen.getByText('Scoops total: $', { exact: false });
    expect(scoopSubtotal).toHaveTextContent('0.00');

    // update vanilla scoops to 1 and check the subtotal
    const vanillaInput = await screen.findByRole('spinbutton', { name: 'Vanilla' });
    userEvent.clear(vanillaInput);
    userEvent.type(vanillaInput, '1');
    expect(scoopSubtotal).toHaveTextContent('2.00');

    // update chocolate scoops to 2 and check the subtotal
    const chocolateInput = await screen.findByRole('spinbutton', { name: 'Chocolate' });
    userEvent.clear(chocolateInput);
    userEvent.type(chocolateInput, '2');
    expect(scoopSubtotal).toHaveTextContent('6.00');
});

test('update toppings subtotal when toppings changed', async () => {
    // render parent component
    render(<Options optionType="toppings" />);

    // make sure total starts out at $0.00
    const toppingSubTotal = screen.getByText('Toppings total: $', { exact: false });
    expect(toppingSubTotal).toHaveTextContent('0.00');

    // add cherries and check subtotal
    const cherriesCheckbox = await screen.findByRole('checkbox', { name: 'Cherries' });
    userEvent.click(cherriesCheckbox);
    expect(toppingSubTotal).toHaveTextContent('1.50');

    // add hot fudge and check subtotal
    const hotFudgeCheckbox = await screen.findByRole('checkbox', { name: 'Hot fudge' });
    userEvent.click(hotFudgeCheckbox);
    expect(toppingSubTotal).toHaveTextContent('3.00');

    // remove hot fudge and check subtotal
    userEvent.click(hotFudgeCheckbox);
    expect(toppingSubTotal).toHaveTextContent('1.50');
})