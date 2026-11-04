import { test, expect } from '../../../fixtures/api.fixture';
import { singleResourceSchema, resourceListSchema } from '../../../schemas/resource.schema';
import { expectJsonSchema, expectStatus } from '../../../utils/helpers/responseAssertions';

test.describe('Resources API - read', () => {
  test('@smoke GET /api/unknown - returns paginated resources', async ({ resourceClient }) => {
    const response = await resourceClient.listResources();

    expectStatus(response, 200);
    const body = await expectJsonSchema(response, resourceListSchema, 'resource list response');

    expect(body.page).toBe(1);
    expect(body.data.length).toBeGreaterThan(0);
    expect(body.data.length).toBeLessThanOrEqual(body.per_page);
    expect(body.total).toBeGreaterThan(0);
  });

  test('@regression GET /api/unknown/2 - returns a single resource', async ({ resourceClient }) => {
    const response = await resourceClient.getResourceById(2);

    expectStatus(response, 200);
    const body = await expectJsonSchema(response, singleResourceSchema, 'single resource response');

    expect(body.data.id).toBe(2);
    expect(body.data.pantone_value.length).toBeGreaterThan(0);
  });

  test('@negative GET /api/unknown/23 - returns 404 for an unknown resource', async ({ resourceClient }) => {
    const response = await resourceClient.getResourceById(23);

    expectStatus(response, 404);
    expect(await response.json()).toEqual({});
  });
});
