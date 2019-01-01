let sourceData;

function fakeInsurers() {
  return [
    {
      id: '000000001',
      name: 'QBE Insurance',
      code: 'QBE',
      isActive: true,
    },
    {
      id: '000000002',
      name: 'IAG Insurance',
      code: 'IAG',
      isActive: true,
    },
    {
      id: '000000003',
      name: 'Dummy Insurance',
      code: 'DUM',
      isActive: false,
    },
  ];
}

function getInsurers (req, res) {
  sourceData = fakeInsurers();
  res.json(sourceData);
}

function postInsurer(req, res) {
  console.log('postInsurer')
  const { body } = req;
  const { method, id } = body;
  let result = sourceData;
  console.log('body', body);

  switch (method) {
    case 'update':
      result.forEach((item, i) => {
        if (item.id === id) {
          result[i] = Object.assign(item, body);
        }
      });
      break;
    case 'post':
      result.unshift({
        body,
        id: `fake-list-${result.length}`,
        createdAt: new Date().getTime(),
      });
      break;
    default:
      break;
  }

  return res.json(result);
}

export default {
  'GET /api/insurers': getInsurers,
  'POST /api/insurers': postInsurer,
};
