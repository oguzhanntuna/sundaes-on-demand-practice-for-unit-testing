import { render, screen } from '@testing-library/react'; 
import userEvent from '@testing-library/user-event';

import App from '../App';

test('order phase for happy path', async () => {
    // render app
    render(<App />);

    // add ice cream scoops and toppings
    const vanillaInput = await screen.findByRole('spinbutton', { name: 'Vanilla' });
    userEvent.clear(vanillaInput);
    userEvent.type(vanillaInput, '1');

    const chocolateInput = await screen.findByRole('spinbutton', { name: 'Chocolate' });
    userEvent.clear(chocolateInput);
    userEvent.type(chocolateInput, '2');

    const cherriesCheckbox = await screen.findByRole('checkbox', { name: 'Cherries' });
    userEvent.click(cherriesCheckbox);

    // find and click order button
    const orderSummaryButton = screen.getByRole('button', { name: 'Order Sundae!' });
    userEvent.click(orderSummaryButton);

    // check summary information based on order
    const summaryHeading = screen.getByRole('heading', { name: 'Order Summary' });
    expect(summaryHeading).toBeInTheDocument();

    const scoopsHeading = screen.getByRole('heading', { name: 'Scoops: $6.00' });
    expect(scoopsHeading).toBeInTheDocument();

    const toppingsHeading = screen.getByRole('heading', { name: 'Toppings: $1.50' });
    expect(toppingsHeading).toBeInTheDocument();

    // check summary option items
    expect(screen.getByText('1 Vanilla')).toBeInTheDocument();
    expect(screen.getByText('2 Chocolate')).toBeInTheDocument();
    expect(screen.getByText('Cherries')).toBeInTheDocument();
    // alternatively...
    const optionItems = screen.getAllByRole('listitem');
    const optionItemsText = optionItems.map((item) => item.textContent);
    expect(optionItemsText).toEqual(['1 Vanilla', '2 Chocolate', 'Cherries']);

    // accept terms and conditions and click button to confirm order
    const tcCheckbox = screen.getByRole('checkbox', { name: /terms and conditions/i });
    userEvent.click(tcCheckbox);
    
    const confirmOrderButton = screen.getByRole('button', { name: 'Confirm order' });
    userEvent.click(confirmOrderButton);

    // expect "loading" to show
    const loader = screen.getByText('Loading');
    expect(loader).toBeInTheDocument();

    // confirm order number on confirmation page
    // this one is async because there is POST request to server in between server and confirmation pages
    const thankYouHeader = await screen.findByRole('heading', { name: /thank you/i });
    expect(thankYouHeader).toBeInTheDocument();

    const orderNumer = await screen.findByText(/order number/i);
    expect(orderNumer).toBeInTheDocument();


    // expect that loading has disappeared
    const notLoading = queryByText("Loading");
    expect(notLoading).not.toBeInTheDocument(); 

    // click "new order" button on confirmation page
    const newOrderButton = screen.getByRole('button', { name: /new order/i });
    userEvent.click(newOrderButton);

    // check that scoops and toppings subtotal have been reset
    const scoopsTotal = screen.getByText('Scoops total: $0.00');
    expect(scoopsTotal).toBeInTheDocument();
    const toppingsTotal = screen.getByText('Toppings total: $0.00');
    expect(toppingsTotal).toBeInTheDocument();

    // wait for items to appear so that Testing Library doesn't get angry about what is happening after test is over
    await screen.findByRole('spinbutton', { name: 'Vanilla' });
    await screen.findByRole('checkbox', { name: 'Cherries' });
});

test('Toppings header is not on summary page if no toppings ordered', async () => {
    // render app
    render(<App />);

    // add ice cream scoops and toppings
    const vanillaInput = await screen.findByRole('spinbutton', { name: 'Vanilla' });
    userEvent.clear(vanillaInput);
    userEvent.type(vanillaInput, '1');

    const chocolateInput = await screen.findByRole('spinbutton', { name: 'Chocolate' });
    userEvent.clear(chocolateInput);
    userEvent.type(chocolateInput, '2');

    // find and click order button
    const orderSummaryButton = screen.getByRole('button', { name: 'Order Sundae!' });
    userEvent.click(orderSummaryButton);

    // check summary information based on order
    const summaryHeading = screen.getByRole('heading', { name: 'Order Summary' });
    expect(summaryHeading).toBeInTheDocument();

    const scoopsHeading = screen.getByRole('heading', { name: 'Scoops: $6.00' });
    expect(scoopsHeading).toBeInTheDocument();

    const toppingsHeading = screen.queryByRole('heading', { name: 'Toppings: $1.50' });
    expect(toppingsHeading).not.toBeInTheDocument();
})