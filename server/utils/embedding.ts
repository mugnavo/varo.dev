import { embed, embedMany } from "ai";

export const generateChunks = (input: string, delimiter = "."): string[] => {
	return input
		.trim()
		.split(delimiter)
		.filter((i) => i !== "");
};

export const generateEmbeddings = async (
	chunks: string[],
): Promise<Array<{ embedding: number[]; content: string }>> => {
	const { embeddings } = await embedMany({
		model: embeddingModel,
		values: chunks,
	});
	return embeddings.map((e, i) => ({ content: chunks[i], embedding: e }));
};

export const generateEmbedding = async (value: string): Promise<number[]> => {
	const input = value.replaceAll("\\n", " ");
	const { embedding } = await embed({
		model: embeddingModel,
		value: input,
	});
	return embedding;
};
