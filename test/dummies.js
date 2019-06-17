let adminRole = {
  id: 1,
  name: 'ADMIN',
  description: 'admin role',
};

let adminUser = {
  id: '1231231231231234',
  name: 'John',
  surname: 'Doe',
};

let dummyUser = {
  id: '123123123123123',
  name: 'John',
  surname: 'Doe',
};

let dummyProject = {
  name: 'test',
  description: 'cga test',
  creation_date: '2019-01-01T01:00:00.000Z',
  user_id: adminUser.id
};

let dummyDataCollection = {
  name: "test", 
  description: "testads", 
  type:"aasdasd", 
  start_date:"2019-01-01T02:00:00.000Z", 
  end_date:"2019-10-01T02:00:00.000Z"
};

let dummySurvey = {
  name: "test survey",
  description: "ASDBJANDJAS"
};

let dummySurveyComponent = {
  name: 'test',
  role_id: adminRole.id,
}

let dummySurveyItem = {
  name: 'test',
  type: 'aaaa',
};

let dummySurveyItemImage = {
  link: 'abcdefghilmnopqrstuz.g.com',
  title: 'title'
};

let dummySurveyItemOption = {
  value: 'ABC',
  type: 'prova',
  name: 'test'
};

let dummySurveyItemOptionLabel = {
  language: 'italian',
  content: 'ciao',
};

let dummySurveyItemLabel = {
  language: 'italian',
  content: 'ciao',
};

let dummySubject = {
  name: 'aassad',
  surname: 'casasda', 
  location: 'asdassad',
  contact: 'aasdasdafaddfsaasdfasdf'
};

let dummyRole = {
  id: 100,
  name: 'ADMIN',
  description: 'admin role',
};

let dummyMember = {
  role_id: dummyRole.id,
  user_id: dummyUser.id,
  status: 'active'
};


let dummyResponse = {
};


let dummyComponentResponse = { 
  user_id: dummyUser.id
};

let dummyItemResponse = {
  name: 'test',
  value: 'aa'
};

let invalid_id = 111111;
let string_id = "AAAA";

module.exports = {string_id, invalid_id, dummyUser, adminRole, adminUser, dummyProject, dummyDataCollection,
  dummySurvey, dummySurveyComponent, dummySurveyItem,  dummySurveyItemOption,  dummySurveyItemOptionLabel, 
  dummySurveyItemLabel, dummySubject,  dummyRole, dummyMember,  dummyResponse, dummyComponentResponse, dummyItemResponse, dummySurveyItemImage};