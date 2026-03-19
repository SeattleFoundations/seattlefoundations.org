export function normalizeNavPath(path: string): string {
	if (path.length > 1 && path.endsWith("/")) {
		return path.slice(0, -1);
	}

	return path;
}

export function isActiveNavPath(currentPath: string, targetPath: string): boolean {
	const normalizedCurrentPath = normalizeNavPath(currentPath);
	const normalizedTargetPath = normalizeNavPath(targetPath);

	if (!normalizedTargetPath.startsWith("/")) {
		return false;
	}

	return (
		normalizedCurrentPath === normalizedTargetPath ||
		(normalizedTargetPath !== "/" && normalizedCurrentPath.startsWith(`${normalizedTargetPath}/`))
	);
}
