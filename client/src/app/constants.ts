type ApplicationStatus = {
  name: string,
  value: string,
  color: "info" | "success" | "error"
};

const applicationStatusList: Array<ApplicationStatus> = [
  {
    name: "considered",
    value: "Розглядається",
    color: "info"
  },
  {
    name: "accepted",
    value: "Прийнято",
    color: "success"
  },
  {
    name: "refused",
    value: "Відхилено",
    color: "error"
  }
];

type Status = {
  name: string,
  value: string,
  color: "info" | "warning" | "success" | "error" | "default"
};

const statusList: Array<Status> = [
  {
    name: "created",
    value: "Створено",
    color: "info"
  },
  {
    name: "inProgress",
    value: "Виконується",
    color: "warning"
  },
  {
    name: "completed",
    value: "Виконано",
    color: "success"
  },
  {
    name: "problem",
    value: "Проблема",
    color: "error"
  },
  {
    name: "canceled",
    value: "Скасовано",
    color: "default"
  }
];

type Role = {
  name: string,
  value: string,
}

const roleList: Array<Role> = [
  {
    name: "administrator",
    value: "Адміністратор"
  },
  {
    name: "client",
    value: "Клієнт"
  },
  {
    name: "employee",
    value: "Працівник"
  }
];

export default {
  applicationStatusList,
  statusList,
  roleList
};
