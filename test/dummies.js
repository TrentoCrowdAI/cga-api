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

let dummyIncompleteUser = {
  id: '123123123123123',
  name: 'John',
};

let dummyProject = {
  name: 'test',
  description: 'cga test',
  creation_date: '2019-01-01T01:00:00.000Z',
  user_id: adminUser.id
};

let dummyIncompleteProject = {
  name: 'test',
  description: 'cga test',
};

let dummyDataCollection = {
  name: "test", 
  description: "testads", 
  type:"aasdasd", 
  start_date:"2019-01-01T02:00:00.000Z", 
  end_date:"2019-10-01T02:00:00.000Z"
};

let dummyIncompleteDataCollection = {
  name: "test", 
  description: "testads", 
  type:"aasdasd", 
  start_date:"2019-01-01T02:00:00.000Z", 
};

let dummySurvey = {
  name: "test survey",
  description: "ASDBJANDJAS"
};

let dummyIncompleteSurvey = {
  name: "test survey",
};

let dummySurveyComponent = {
  name: 'test',
  role_id: adminRole.id,
}

let dummyIncompleteSurveyComponent = {
  role_id: adminRole.id,
};

let dummySurveyItem = {
  name: 'test',
  type: 'aaaa',
};

let dummyIncompleteSurveyItem = {
  name: 'test',
};

let dummySurveyItemOption = {
  value: 'ABC',
  type: 'prova',
  name: 'test'
};

let dummyIncompleteSurveyItemOption = {
  type: 'prova',
  name: 'test'
};

let dummySurveyItemOptionLabel = {
  language: 'italian',
  content: 'ciao',
};

let dummyIncompleteSurveyItemLabel = {
  language: 'italian',
};

let dummyIncompleteSurveyItemOptionLabel = {
  language: 'italian',
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

let dummyIncompleteSubject = {
  name: 'aassad',
  surname: 'casasda', 
  location: 'asdassad',
};

let dummyRole = {
  id: 100,
  name: 'ADMIN',
  description: 'admin role',
};

let dummyIncompleteRole = {
  id: 1,
  name: 'ADMIN',
};

let dummyMember = {
  role_id: dummyRole.id,
  user_id: dummyUser.id,
  status: 'active'
};

let dummyIncompleteMember = {
  status: 'active'
};

let invalid_id = 111111;
let string_id = "AAAA";

module.exports = {string_id, invalid_id, dummyUser, dummyIncompleteUser, adminRole, adminUser, dummyProject, dummyIncompleteProject, dummyDataCollection, dummyIncompleteDataCollection,
  dummySurvey, dummyIncompleteSurvey, dummySurveyComponent, dummySurveyItem, dummyIncompleteSurveyItem, dummySurveyItemOption, dummyIncompleteSurveyItemOption, dummySurveyItemOptionLabel, 
  dummyIncompleteSurveyItemLabel, dummyIncompleteSurveyItemOptionLabel, dummySurveyItemLabel, dummyIncompleteSurveyComponent, dummySubject, dummyIncompleteSubject, dummyRole, dummyIncompleteRole, 
  dummyMember, dummyIncompleteMember};