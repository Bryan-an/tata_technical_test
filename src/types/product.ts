export namespace ProductModel {
  export namespace Request {
    export interface Create {
      id: string;
      name: string;
      description: string;
      logo: string;
      date_release: string;
      date_revision: string;
    }

    export interface Update {
      name: string;
      description: string;
      logo: string;
      date_release: string;
      date_revision: string;
    }
  }

  export namespace Response {
    export interface GetAll {
      data: GetAll.Datum[];
    }

    export namespace GetAll {
      export interface Datum {
        id: string;
        name: string;
        description: string;
        logo: string;
        date_release: string;
        date_revision: string;
      }
    }

    export interface GetOne {
      id: string;
      name: string;
      description: string;
      logo: string;
      date_release: string;
      date_revision: string;
    }

    export interface Create {
      message: string;
      data: Create.Datum;
    }

    export namespace Create {
      export interface Datum {
        id: string;
        name: string;
        description: string;
        logo: string;
        date_release: string;
        date_revision: string;
      }
    }

    export interface Update {
      message: string;
      data: Update.Datum;
    }

    export namespace Update {
      export interface Datum {
        name: string;
        description: string;
        logo: string;
        date_release: string;
        date_revision: string;
      }
    }

    export interface Delete {
      message: string;
    }
  }
}
