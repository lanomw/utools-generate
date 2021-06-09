module.exports = {
    /**
     * 获取指定范围的随机数，包含最大值
     * @param min
     * @param max
     * @return {number}
     *
     * @example random() -> 0~1
     * @example random(10) -> 0~10
     * @example random(5, 10) -> 5~10
     */
    random(min = 1, max) {
        if (!max) {
            max = min
            min = 0
        }
        return Math.round((max - min) * Math.random() + min);
    }
}
