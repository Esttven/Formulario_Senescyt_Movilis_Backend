import { HealthController } from './health.controller';

describe('HealthController', () => {
  it('returns a healthy status', () => {
    const controller = new HealthController();
    const result = controller.getHealth();

    expect(result.status).toBe('ok');
    expect(result.service).toBe('forms-senescyt-backend');
    expect(result.timestamp).toEqual(expect.any(String));
  });
});
