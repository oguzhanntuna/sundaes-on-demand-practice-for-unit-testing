import { fireEvent, render, screen } from "@testing-library/react";
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

    fireEvent.click(checkbox);
    expect(submitButton).toBeEnabled();

    fireEvent.click(checkbox);
    expect(submitButton).toBeDisabled();
});