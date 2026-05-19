const PdfPrinter = require('pdfmake');
const path = require('path');
const fs = require('fs');
const { Quotation, Client, Package, QuotationSpace, QuotationSpaceWorkItem, QuotationNote } = require('../models');
const { text } = require('stream/consumers');
const dayjs = require('dayjs');

const IMAGE_DIR = path.join(__dirname, '..', 'assets');
const FONT_DIR = path.join(__dirname, '..', 'assets', 'fonts');

// Define fonts
const fonts = {
    Helvetica: {
        normal: path.join(FONT_DIR, 'Helvetica.ttf'),
        bold: path.join(FONT_DIR, 'Helvetica-Bold.ttf'),
        italics: path.join(FONT_DIR, 'Helvetica-Oblique.ttf'),
        bolditalics: path.join(FONT_DIR, 'Helvetica-BoldOblique.ttf')
    }
};

const printer = new PdfPrinter(fonts);

/**
 * Helper to get absolute image path
 */
const getImagePath = (filename) => {
    return path.join(IMAGE_DIR, filename);
};

const bgPath = getImagePath('3.png');
exports.generatePdf = async (req, res) => {
    const startTime = process.hrtime.bigint(); // high-resolution time
    const startCpu = process.cpuUsage();       // CPU snapshot
    const startMem = process.memoryUsage();
    try {
        const id = req.params.id;

        // If ID is not in params, check query
        const quotationId = id || req.query.id;

        const view = req.query.view === 'true' || req.query.view === '1';


        // Fetch quotation data
        let quotationData = null;
        if (quotationId) {
            quotationData = await Quotation.findByPk(quotationId, {
                include: [
                    { model: Client, as: 'client' },
                    { model: Package, as: 'package' }, // Assuming association exists
                    {
                        model: QuotationSpace,
                        as: 'spaces',
                        include: [{ model: QuotationSpaceWorkItem, as: 'workItems' }],
                        order: [[{ model: QuotationSpaceWorkItem, as: 'workItems' }, 'order', 'ASC']]
                    },
                    { model: QuotationNote, as: 'quotationNotes' }
                ],
                order: [
                    [{ model: QuotationSpace, as: 'spaces' }, 'order', 'ASC'],
                    [{ model: QuotationSpace, as: 'spaces' }, { model: QuotationSpaceWorkItem, as: 'workItems' }, 'order', 'ASC']
                ]
            });
        }

        let filename = 'document.pdf';
        if (quotationData && quotationData.client && quotationData.package) {
            const clean = (str) => (str || '').trim().replace(/[^a-zA-Z0-9]/g, '_');
            const clientName = clean(quotationData.client.name);
            const packageName = clean(quotationData.package.type);
            const packageType = clean(quotationData.package.category);

            filename = `${clientName}_${packageName}_${packageType}.pdf`;
        }

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader(
            'Content-Disposition',
            (view ? 'inline' : 'attachment') + `; filename="${filename}"`
        );

        // Calculate items total
        let itemsTotal = 0;
        if (quotationData && quotationData.spaces) {
            quotationData.spaces.forEach(space => {
                if (space.workItems) {
                    space.workItems.forEach(item => {
                        itemsTotal += parseFloat(item.total) || 0;
                    });
                }
            });
        }

        const A4_WIDTH = 595.28;
        const A4_HEIGHT = 841.89;

        // Content definition
        const content = [];

        // Helper to add full page image
        const addFullPageImage = (imgName, pageBreak = 'after') => {
            const imgPath = getImagePath(imgName);
            if (fs.existsSync(imgPath)) {
                content.push({
                    image: imgPath,
                    width: A4_WIDTH,
                    height: A4_HEIGHT,
                    absolutePosition: { x: 0, y: 0 },
                    pageBreak: pageBreak
                });
            }
        };

        // 1. Front Images
        addFullPageImage('1.png');
        addFullPageImage('2.png'); // Ensure page break after 2.png

        // Page 3: Client & Quotation Details
        if (quotationData) {
            const client = quotationData.client || {};
            const q = quotationData;

            // content push image 4.png
            content.push({
                image: getImagePath('4.png'),
                width: A4_WIDTH,
                height: A4_HEIGHT,
                absolutePosition: { x: 0, y: 0 },
            });
            content.push({
                stack: [
                    { text: "Client Name", bold: true, color: '#d1b67e', fontSize: 18, margin: [0, 10, 0, 5] },
                    { text: client.name, bold: true, color: '#ffffff', fontSize: 16, margin: [0, 0, 0, 5] },
                    { text: "Quotation No: ", bold: true, color: '#d1b67e', fontSize: 18, margin: [0, 10, 0, 5] },
                    { text: q.quotationNumber || '-', bold: true, color: '#ffffff', fontSize: 16, margin: [0, 0, 0, 5] },
                    { text: "Valid Upto ", bold: true, color: '#d1b67e', fontSize: 18, margin: [0, 10, 0, 5] },
                    { text: dayjs(q.validTo).format('DD/MM/YYYY'), bold: true, color: '#ffffff', fontSize: 16, margin: [0, 0, 0, 5] },
                    { text: "Project Name", bold: true, color: '#d1b67e', fontSize: 18, margin: [0, 10, 0, 5] },
                    { text: q.projectName || '-', bold: true, color: '#ffffff', fontSize: 16, margin: [0, 0, 0, 5] },
                    { text: "Address", bold: true, color: '#d1b67e', fontSize: 18, margin: [0, 10, 0, 5] },
                    { text: client.address || '-', bold: true, color: '#ffffff', fontSize: 16, margin: [0, 0, 0, 5] },
                    { text: "Project Cordinator", bold: true, color: '#d1b67e', fontSize: 18, margin: [0, 10, 0, 5] },
                    { text: q.salesPersonName + " (" + q.salesPersonMobile + ")" || '-', bold: true, color: '#ffffff', fontSize: 16, margin: [0, 0, 0, 5] },
                ],
                margin: [0, 50, 0, 30],
                pageBreak: 'after'
            });
        }


        // 2. Tables
        let tables = [];

        if (quotationData && quotationData.spaces) {
            // Transform spaces into tables
            tables = quotationData.spaces.map(space => {
                const rows = space.workItems ? space.workItems.map((item, idx) => [
                    `${idx + 1}`,
                    item.item, // Description
                ]) : [];

                return {
                    tableName: space.name, // e.g., 'Living Room'
                    headers: ['Sr No', 'Description'],
                    rows: rows
                };
            });
        }

        tables.forEach((t, index) => {
            // Table Body building
            const body = [];

            // 1. Space Name Row (Integrated as Header Row 1)
            // This ensures it stays with the table and follows keepWithHeaderRows logic
            if (t.tableName) {
                body.push([
                    {
                        text: t.tableName,
                        colSpan: 2,
                        style: 'tableHeader',
                        border: [false, false, false, false],
                        margin: [0, 10, 0, 5],
                        alignment: 'left'
                    },
                    {}
                ]);
            }

            // 2. Column Headers (Header Row 2)
            const headerRow = t.headers.map((h) => ({
                text: h,
                style: 'tableHeaderCell',
                fillColor: '#071854',
                color: '#ffffff',
                alignment: 'center'
            }));
            body.push(headerRow);

            // 3. Data Rows
            if (t.rows && t.rows.length > 0) {
                t.rows.forEach(row => {
                    const dataRow = row.map((cell, idx) => ({
                        text: cell,
                        style: 'tableCell',
                        alignment: idx === 1 ? 'left' : 'center'
                    }));
                    body.push(dataRow);
                });
            } else {
                body.push(Array(t.headers.length).fill({ text: '-', alignment: 'center', style: 'tableCell' }));
            }

            content.push({
                table: {
                    headerRows: 2, // Title + Columns
                    keepWithHeaderRows: 1, // Ensures Title+Columns+FirstDataRow stay together
                    widths: [30, '*'],
                    body: body
                },
                layout: {
                    hLineWidth: function (i, node) {
                        // i=0: Top of table (Above Title)
                        // i=1: Below Title (Above Header)
                        if (i === 0 || i === 1) return 0;
                        return 0.5;
                    },
                    vLineWidth: function (i, node) { return 0.5; },
                    hLineColor: function (i, node) { return 'black'; },
                    vLineColor: function (i, node) { return 'black'; },
                    paddingLeft: function (i, node) { return 5; },
                    paddingRight: function (i, node) { return 5; },
                    paddingTop: function (i, node) { return 5; },
                    paddingBottom: function (i, node) { return 5; },
                },
                margin: [0, 0, 0, 20]
            });
        });


        content.push({
            image: getImagePath('5.png'),
            width: A4_WIDTH,
            height: A4_HEIGHT,
            absolutePosition: { x: 0, y: 0 },
            pageBreak: 'before'
        })

        // Determine base cost to display
        let displaySubtotal = itemsTotal;
        if (quotationData.costType === 'Fixed') {
            displaySubtotal = parseFloat(quotationData.fixedCost) || 0;
        }

        content.push({
            text: 'Cost : ₹ ' + displaySubtotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '/-',
            absolutePosition: { x: 90, y: 480 },
            fontSize: 12,
            color: '#ffffff',
            bold: true,
            margin: [0, 0, 0, 20]
        })

        if (quotationData.discountPercentage >= 1) {
            content.push({
                text: 'Discount : ' + (quotationData.discountPercentage || 0) + '%',
                absolutePosition: { x: 90, y: 500 },
                fontSize: 12,
                bold: true,
                color: '#ffffff',
                margin: [0, 0, 0, 20]
            })
            content.push({
                text: 'Total : ₹ ' + parseFloat(quotationData.totalCost).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '/-',
                absolutePosition: { x: 90, y: 520 },
                fontSize: 12,
                bold: true,
                color: '#ffffff',
                margin: [0, 0, 0, 20]
            })
        }



        // notes

        if (Array.isArray(quotationData.quotationNotes)) {
            content.push({
                image: bgPath,
                width: A4_WIDTH,
                height: A4_HEIGHT,
                absolutePosition: { x: 0, y: 0 },
                pageBreak: 'before'
            })
            let index = 0;
            // heading notes
            content.push({
                text: 'Notes',
                fontSize: 20,
                bold: true,
                color: '#000000',
                margin: [0, 0, 0, 10]
            })
            quotationData.quotationNotes.forEach(note => {
                content.push({
                    text: index + 1 + ". " + note.note.replace(/र/g, '₹ '),
                    fontSize: 12,
                    color: '#000000',
                    margin: [0, 0, 0, 10]
                })
                index++;
            })
        }

        content.push({
            image: getImagePath('6.png'),
            width: A4_WIDTH,
            height: A4_HEIGHT,
            absolutePosition: { x: 0, y: 0 },
            pageBreak: 'before'
        })

        content.push({
            image: getImagePath('7.png'),
            width: A4_WIDTH,
            height: A4_HEIGHT,
            absolutePosition: { x: 0, y: 0 },
            pageBreak: 'before'
        })

        content.push({
            image: getImagePath('8.png'),
            width: A4_WIDTH,
            height: A4_HEIGHT,
            absolutePosition: { x: 0, y: 0 },
            pageBreak: 'before'
        })

        content.push({
            image: getImagePath('9.png'),
            width: A4_WIDTH,
            height: A4_HEIGHT,
            absolutePosition: { x: 0, y: 0 },
            pageBreak: 'before'
        })

        content.push({
            image: getImagePath('10.png'),
            width: A4_WIDTH,
            height: A4_HEIGHT,
            absolutePosition: { x: 0, y: 0 },
            pageBreak: 'before'
        })
        if (content.length > 0) {
            const last = content[content.length - 1];
            if (last.pageBreak === 'after') {
                delete last.pageBreak;
            }
        }

        // Document Definition
        const docDefinition = {
            pageSize: 'A4',
            pageMargins: [40, 90, 40, 80],
            background: function (currentPage, pageSize) {
                if (currentPage > 3) {
                    if (fs.existsSync(bgPath)) {
                        const bgItems = [
                            {
                                image: bgPath,
                                width: pageSize.width,
                                height: pageSize.height,
                                absolutePosition: { x: 0, y: 0 }
                            }
                        ];

                        if (quotationData && quotationData.package && quotationData.package.name) {
                            bgItems.push({
                                absolutePosition: { x: 0, y: 50 },
                                width: pageSize.width,
                                columns: [
                                    { text: '', width: '*' },
                                    {
                                        text: quotationData.package.type + " " + quotationData.package.category,
                                        width: 'auto',
                                        fontSize: 18,
                                        bold: true,
                                        color: '#071854',
                                        margin: [0, 0, 40, 0]
                                    }
                                ]
                            });
                        }

                        return bgItems;
                    }
                }
                return null;
            },
            content: content,
            defaultStyle: {
                font: 'Helvetica',
                fontSize: 10
            },
            styles: {
                header: {
                    fontSize: 22,
                    bold: true,
                    color: '#071854'
                },
                subheader: {
                    fontSize: 14,
                    bold: true,
                    decoration: 'underline',
                    color: '#071854'
                },
                tableHeader: {
                    fontSize: 14,
                    bold: true,
                    margin: [0, 0, 0, 10]
                },
                tableHeaderCell: {
                    bold: true,
                    fontSize: 10
                },
                tableCell: {
                    fontSize: 10
                }
            }
        };

        const pdfDoc = printer.createPdfKitDocument(docDefinition);
        const chunks = [];

        pdfDoc.on('data', (chunk) => {
            chunks.push(chunk);
        });

        pdfDoc.on('end', () => {
            const result = Buffer.concat(chunks);

            // Set explicit content length for progress tracking
            res.setHeader('Content-Length', result.length);
            res.send(result);

            // ---- PERFORMANCE END ----
            const endTime = process.hrtime.bigint();
            const endCpu = process.cpuUsage(startCpu);
            const endMem = process.memoryUsage();

            const timeMs = Number(endTime - startTime) / 1e6;

            console.log('📄 PDF Generation Performance');
            console.log('⏱ Time:', timeMs.toFixed(2), 'ms');

            console.log(
                '🧠 CPU:',
                `User ${(endCpu.user / 1000).toFixed(2)} ms`,
                `System ${(endCpu.system / 1000).toFixed(2)} ms`
            );

            console.log(
                '💾 RAM:',
                `Heap Used ${((endMem.heapUsed - startMem.heapUsed) / 1024 / 1024).toFixed(2)} MB`,
                `RSS ${((endMem.rss - startMem.rss) / 1024 / 1024).toFixed(2)} MB`
            );

            console.log('-----------------------------');
        });

        pdfDoc.end();


    } catch (err) {
        console.error('Error generating PDF:', err);
        if (!res.headersSent) {
            res.status(500).send('Error generating PDF');
        }
    }
};