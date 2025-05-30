export const hidePhone = (phone?: string): string | undefined => {
  if (!phone) {
    return undefined;
  }

  return phone.replace(phone.slice(2, 7), '*****');
};
