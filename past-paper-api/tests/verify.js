import app from '../src/app.js';
import http from 'http';

const server = http.createServer(app);

server.listen(0, async () => {
  const port = server.address().port;
  const baseUrl = `http://localhost:${port}`;
  console.log(`Test server started on port ${port}`);

  try {
    // 1. Test Health endpoint
    const resHealth = await fetch(`${baseUrl}/api/v1/health`);
    const jsonHealth = await resHealth.json();
    console.log('✓ Health Endpoint:', resHealth.status, jsonHealth.data.status);
    assert(resHealth.status === 200, 'Health status should be 200');
    assert(jsonHealth.data.status === 'ok', 'Health status should be ok');

    // 2. Test Levels endpoint
    const resLevels = await fetch(`${baseUrl}/api/v1/levels`);
    const jsonLevels = await resLevels.json();
    console.log('✓ Levels Endpoint:', resLevels.status, 'Received levels count:', jsonLevels.data?.length ?? 0);
    assert(resLevels.status === 200, 'Levels status should be 200');
    assert(Array.isArray(jsonLevels.data), 'Levels data should be an array');

    // 3. Test Subjects endpoint
    const resSubjects = await fetch(`${baseUrl}/api/v1/subjects?level=O/L`);
    const jsonSubjects = await resSubjects.json();
    console.log('✓ Subjects Endpoint:', resSubjects.status, 'Received subjects count:', jsonSubjects.data?.length ?? 0);
    assert(resSubjects.status === 200, 'Subjects status should be 200');

    // 4. Test Papers endpoint
    const resPapers = await fetch(`${baseUrl}/api/v1/papers?level=O/L&page=1&limit=5`);
    const jsonPapers = await resPapers.json();
    console.log('✓ Papers List Endpoint:', resPapers.status, 'Page:', jsonPapers.meta?.page, 'Total:', jsonPapers.meta?.total);
    assert(resPapers.status === 200, 'Papers status should be 200');
    assert(jsonPapers.meta && jsonPapers.meta.page === 1, 'Meta page should be 1');

    // 5. Test Invalid Year validation error
    const resBadYear = await fetch(`${baseUrl}/api/v1/papers?year=bad_year`);
    const jsonBadYear = await resBadYear.json();
    console.log('✓ Validation Error Endpoint:', resBadYear.status, jsonBadYear.error?.code);
    assert(resBadYear.status === 400, 'Bad year should return 400');
    assert(jsonBadYear.error.code === 'VALIDATION_ERROR', 'Error code should be VALIDATION_ERROR');

    // 6. Test Non-existent Paper ID
    const resNotFound = await fetch(`${baseUrl}/api/v1/papers/00000000-0000-0000-0000-000000000000`);
    const jsonNotFound = await resNotFound.json();
    console.log('✓ 404 Not Found Endpoint:', resNotFound.status, jsonNotFound.error?.code);
    assert(resNotFound.status === 404, 'Non-existent UUID should return 404');

    // 7. Test Docs Endpoint
    const resDocs = await fetch(`${baseUrl}/docs/`);
    console.log('✓ OpenAPI Docs Endpoint:', resDocs.status);
    assert(resDocs.status === 200, 'Docs endpoint should return 200');

    console.log('\n🎉 ALL INTEGRATION VERIFICATION CHECKS PASSED SUCCESSFULLY!');
  } catch (err) {
    console.error('❌ Verification failed:', err);
    process.exitCode = 1;
  } finally {
    server.close();
  }
});

function assert(condition, message) {
  if (!condition) {
    throw new Error(`Assertion Failed: ${message}`);
  }
}
