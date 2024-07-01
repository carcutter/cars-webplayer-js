abstract class AbstractWebComponent extends HTMLElement {
  protected getPropsFromAttributes<T>(): T {
    const normalizeAttribute = (attribute: string) =>
      attribute.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());

    const props: Record<string, string> = {};

    for (let index = 0; index < this.attributes.length; index++) {
      const attribute = this.attributes[index];
      props[normalizeAttribute(attribute.name)] = attribute.value;
    }

    return props as T;
  }
}

export default AbstractWebComponent;
