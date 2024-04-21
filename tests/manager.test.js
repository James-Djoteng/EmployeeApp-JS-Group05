import Manager from '../src/models/manager';

describe('manager class', () => {
  it('calculatePaycheck method returns correct total paycheck amount', () => {
    // We are creating a Manager instance with base salary 2000 and bonus 500
    const manager = new Manager('1', 'James Djoteng', 'Marketi', 2000, 500);

    // we are making sure calculatePaycheck returns correct total paycheck amount
    expect(manager.calculatePaycheck()).toBe(2500);
  });
});
