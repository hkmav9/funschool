/* progress.js - Reusable progress bar utility for all modules */

function renderProgressBar(config) {
    /*
     * Simple progress bar renderer
     * config = {
     *   current: number,
     *   max: number,
     *   label: string (optional),
     *   color: string (hex color, optional - defaults to yellow)
     * }
     * Returns HTML string for progress bar
     */
    const current = config.current || 0;
    const max = config.max || 100;
    const label = config.label || '';
    const color = config.color || '#FFD93D';

    const percentage = Math.min((current / max) * 100, 100);

    let html = '<div class="progress-bar-container">';
    html += '<div class="progress-bar">';
    html += '<div class="progress-fill" style="width:' + percentage + '%;background:' + color + '"></div>';
    html += '</div>';

    if (label) {
        html += '<div class="progress-label">' + label + '</div>';
    }

    html += '</div>';

    return html;
}

function renderProgressBarWithFormat(config) {
    /*
     * Advanced version with custom formatting
     * config = {
     *   current: number,
     *   max: number,
     *   label: string (optional),
     *   format: 'count' | 'percent' | 'custom' (optional, default: 'count')
     *   customFormat: function(current, max) => string (optional)
     *   color: string (optional)
     *   showLabel: boolean (optional, default: true)
     * }
     */
    const current = config.current || 0;
    const max = config.max || 100;
    const format = config.format || 'count';
    const color = config.color || '#FFD93D';
    const showLabel = config.showLabel !== false;

    const percentage = Math.min((current / max) * 100, 100);

    let labelText = '';

    if (showLabel) {
        if (format === 'count') {
            labelText = current + '/' + max + (config.label ? ' ' + config.label : '');
        } else if (format === 'percent') {
            labelText = Math.round(percentage) + '%' + (config.label ? ' ' + config.label : '');
        } else if (format === 'custom' && config.customFormat) {
            labelText = config.customFormat(current, max);
        } else if (config.label) {
            labelText = config.label;
        }
    }

    let html = '<div class="progress-bar-container">';
    html += '<div class="progress-bar">';
    html += '<div class="progress-fill" style="width:' + percentage + '%;background:' + color + '"></div>';
    html += '</div>';

    if (labelText) {
        html += '<div class="progress-label">' + labelText + '</div>';
    }

    html += '</div>';

    return html;
}
