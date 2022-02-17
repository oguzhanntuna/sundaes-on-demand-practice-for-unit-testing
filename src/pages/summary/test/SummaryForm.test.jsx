import { render, screen, waitForElementToBeRemoved } from "@testing-library/react";
import userEvent from '@testing-library/user-event';
import SummaryForm from '../SummaryForm';

test('Initial conditions', () => {
    render(<SummaryForm />);

    const checkbox = screen.getByRole('checkbox', { name: 'I agree to Terms and Conditions' }); 
    expect(checkbox).not.toBeChecked();

    const submitButton = screen.getByRole('button', { name: 'Confirm order' }); 
    expect(submitButton).toBeDisabled();
});

test('Checkbox enables button on first click and disables on second click.', () => {
    render(<SummaryForm />);

    const checkbox = screen.getByRole('checkbox', { name: 'I agree to Terms and Conditions' });
    const submitButton = screen.getByRole('button', { name: 'Confirm order' });

    userEvent.click(checkbox);
    expect(submitButton).toBeEnabled();

    userEvent.click(checkbox);
    expect(submitButton).toBeDisabled();
});

test('popover responds to hover', async () => {
    render(<SummaryForm />);

    // popover starts out hidden
    const nullPopover = screen.queryByText('No ice cream will actually be delivered');
    expect(nullPopover).not.toBeInTheDocument();

    // popover appears upon mouseover of checkbox label
    const termsAndConditions = screen.getByText('Terms and Conditions');
    userEvent.hover(termsAndConditions);

    const popover = screen.getByText('No ice cream will actually be delivered');
    expect(popover).toBeInTheDocument();

    // popover disappears when mouse out
    userEvent.unhover(termsAndConditions);
    await waitForElementToBeRemoved(() => screen.queryByText('No ice cream will actually be delivered'));
})