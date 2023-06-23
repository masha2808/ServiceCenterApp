import { IApplicationData } from "../types/application";
import { IOrderData } from "../types/order";
import { IServiceCenterData } from "../types/service-center";
import { ITaskData } from "../types/task";

const sortServiceCenterListByName = (serviceCenterList: Array<IServiceCenterData>, sortingAsc: boolean) => {
  serviceCenterList.sort((serviceCenter1: IServiceCenterData, serviceCenter2: IServiceCenterData) => {
    if (serviceCenter1.name < serviceCenter2.name) {
      return sortingAsc ? -1 : 1;
    } else if (serviceCenter1.name > serviceCenter2.name) {
      return sortingAsc ? 1 : -1;
    }
    return 0;
  });
};

const sortApplicationListByNumber = (applicationList: Array<IApplicationData>, sortingAsc: boolean) => {
  applicationList.sort((application1: IApplicationData, application2: IApplicationData) => {
    if (application1.number < application2.number) {
      return sortingAsc ? -1 : 1;
    } else if (application1.number > application2.number) {
      return sortingAsc ? 1 : -1;
    }
    return 0;
  });
};

const sortApplicationListByDate = (applicationList: Array<IApplicationData>, sortingAsc: boolean) => {
  applicationList.sort((application1: IApplicationData, application2: IApplicationData) => {
    if (application1.dateTimeCreated < application2.dateTimeCreated) {
      return sortingAsc ? -1 : 1;
    } else if (application1.dateTimeCreated > application2.dateTimeCreated) {
      return sortingAsc ? 1 : -1;
    }
    return 0;
  });
};

const sortOrderListByNumber = (orderList: Array<IOrderData>, sortingAsc: boolean) => {
  orderList.sort((order1: IOrderData, order2: IOrderData) => {
    if (order1.number < order2.number) {
      return sortingAsc ? -1 : 1;
    } else if (order1.number > order2.number) {
      return sortingAsc ? 1 : -1;
    }
    return 0;
  });
};

const sortOrderListByDateTimeCreated = (orderList: Array<IOrderData>, sortingAsc: boolean) => {
  orderList.sort((order1: IOrderData, order2: IOrderData) => {
    if (order1.dateTimeCreated < order2.dateTimeCreated) {
      return sortingAsc ? -1 : 1;
    } else if (order1.dateTimeCreated > order2.dateTimeCreated) {
      return sortingAsc ? 1 : -1;
    }
    return 0;
  });
};

const sortOrderListByPlannedDateCompleted = (orderList: Array<IOrderData>, sortingAsc: boolean) => {
  orderList.sort((order1: IOrderData, order2: IOrderData) => {
    if (order1.plannedDateCompleted && order2.plannedDateCompleted) {
      if (order1.plannedDateCompleted < order2.plannedDateCompleted) {
        return sortingAsc ? -1 : 1;
      } else if (order1.plannedDateCompleted > order2.plannedDateCompleted) {
        return sortingAsc ? 1 : -1;
      }
    }
    return 0;
  });
};

const sortOrderListByDateCompleted = (orderList: Array<IOrderData>, sortingAsc: boolean) => {
  orderList.sort((order1: IOrderData, order2: IOrderData) => {
    if (order1.dateCompleted && order2.dateCompleted) {
      if (order1.dateCompleted < order2.dateCompleted) {
        return sortingAsc ? -1 : 1;
      } else if (order1.dateCompleted > order2.dateCompleted) {
        return sortingAsc ? 1 : -1;
      }
    }
    return 0;
  });
};

const sortTaskListById = (orderList: Array<ITaskData>, sortingAsc: boolean) => {
  orderList.sort((order1: ITaskData, order2: ITaskData) => {
    if (order1.id < order2.id) {
      return sortingAsc ? -1 : 1;
    } else if (order1.id > order2.id) {
      return sortingAsc ? 1 : -1;
    }
    return 0;
  });
};

const sortTaskListByName = (orderList: Array<ITaskData>, sortingAsc: boolean) => {
  orderList.sort((order1: ITaskData, order2: ITaskData) => {
    if (order1.name < order2.name) {
      return sortingAsc ? -1 : 1;
    } else if (order1.name > order2.name) {
      return sortingAsc ? 1 : -1;
    }
    return 0;
  });
};


const sortTaskListByDateTimeCreated = (orderList: Array<ITaskData>, sortingAsc: boolean) => {
  orderList.sort((order1: ITaskData, order2: ITaskData) => {
    if (order1.dateTimeCreated < order2.dateTimeCreated) {
      return sortingAsc ? -1 : 1;
    } else if (order1.dateTimeCreated > order2.dateTimeCreated) {
      return sortingAsc ? 1 : -1;
    }
    return 0;
  });
};

const sortTaskListByPlannedDateCompleted = (orderList: Array<ITaskData>, sortingAsc: boolean) => {
  orderList.sort((order1: ITaskData, order2: ITaskData) => {
    if (order1.plannedDateCompleted && order2.plannedDateCompleted) {
      if (order1.plannedDateCompleted < order2.plannedDateCompleted) {
        return sortingAsc ? -1 : 1;
      } else if (order1.plannedDateCompleted > order2.plannedDateCompleted) {
        return sortingAsc ? 1 : -1;
      }
    }
    return 0;
  });
};

const sortTaskListByDateCompleted = (orderList: Array<ITaskData>, sortingAsc: boolean) => {
  orderList.sort((order1: ITaskData, order2: ITaskData) => {
    if (order1.dateCompleted && order2.dateCompleted) {
      if (order1.dateCompleted < order2.dateCompleted) {
        return sortingAsc ? -1 : 1;
      } else if (order1.dateCompleted > order2.dateCompleted) {
        return sortingAsc ? 1 : -1;
      }
    }
    return 0;
  });
};

export {
  sortServiceCenterListByName,
  sortApplicationListByNumber,
  sortApplicationListByDate,
  sortOrderListByNumber,
  sortOrderListByDateTimeCreated,
  sortOrderListByPlannedDateCompleted,
  sortOrderListByDateCompleted,
  sortTaskListById,
  sortTaskListByName,
  sortTaskListByDateTimeCreated,
  sortTaskListByPlannedDateCompleted,
  sortTaskListByDateCompleted
};