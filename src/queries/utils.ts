import { Configuration } from "@tba3/api-resources";

type CustomWindow = Window & {
  appConfig?: {
    api?: {
      baseUrl?: string;
    };
    defaultPageSize?: number;
  };
};

export async function apiConfiguration(): Promise<Configuration> {
  const configFromWindow = (window as CustomWindow).appConfig?.api?.baseUrl || '';
  const config = new Configuration({ basePath: configFromWindow});
  return config;
}

