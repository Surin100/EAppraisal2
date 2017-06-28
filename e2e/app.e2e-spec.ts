import { EAppraisal2Page } from './app.po';

describe('eappraisal2 App', () => {
  let page: EAppraisal2Page;

  beforeEach(() => {
    page = new EAppraisal2Page();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
