// TODO put this in an env var
const clientId = "089968a9461e704";

var myHeaders = new Headers();
myHeaders.append("Authorization", `Client-ID ${clientId}`);

const requestOptions: RequestInit = {
  method: "GET",
  headers: myHeaders,
};

const mapImageData = (data: any) => {
  return {
    id: data.id,
    title: data.title,
    description: data.description,
    link: data.link,
    gifv: data.gifv,
    mp4: data.mp4,
    animated: data.animated,
    metadata: {
      width: data.width,
      height: data.height,
      mimeType: data.type,
    },
  };
};

const imageData = async (hash: string): Promise<ImageResponse[]> => {
  const response = await fetch(
    `https://api.imgur.com/3/image/${hash}`,
    requestOptions
  );

  if (response.status !== 200) {
    throw `Error fetching image data: ${response.status}`;
  }

  const result = await response.json();
  const data = mapImageData(result.data);
  return [data];
};

const galleryData = async (hash: string): Promise<ImageResponse[]> => {
  const response = await fetch(
    `https://api.imgur.com/3/gallery/${hash}`,
    requestOptions
  );

  if (response.status !== 200) {
    throw `Error fetching gallery data: ${response.status}`;
  }

  const result = await response.json();
  const data = result.data.images.map((image: any) => mapImageData(image));
  return data;
};

export const getDataForUrl = async (url: string): Promise<ImageResponse[]> => {
  if (url.includes("/gallery/")) {
    const galleryHash = url.split("/").at(-1);
    return await galleryData(galleryHash!!);
  } else {
    const imageHash = url.split("/").at(-1);
    return await imageData(imageHash!!);
  }
};

export const isImgurUrl = (url: string): boolean => {
  return url.includes("imgur.com") && !url.includes("i.imgur.com");
};

interface ImageResponse {
  id: string;
  title?: string;
  description?: string;
  link: string;
  gifv?: string;
  mp4?: string;
  animated: boolean;
  metadata: {
    width: number;
    height: number;
    mimeType: string;
  };
}
