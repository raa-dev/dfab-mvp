export interface IPublication {
  uri: string;
  id: bigint;
  title: string;
  summary: string;
  author: string;
  cost: bigint;
  upVotes: bigint;
  downVotes: bigint;
  commentsCount: bigint;
  tags: string[];
  createdAt: bigint;
  quantity: bigint;
}

export interface IProfile {
  bio: string;
  username: string;
  owner: string;
  following: string[];
  followers: string[];
  publications: IPublication[];
  publicationIds: bigint;
}
