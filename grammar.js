
module.exports = grammar({
  name: 'dqd',

  extras: $ => [
    /\s/,
    $.comment,
    $.bbcode
  ],

  rules: {
    source_file: $ => repeat($._statement),

    _statement: $ => choice(
      $.branch_statement,
      $.call_statement,
      $.choice_statement,
      $.exit_statement,
      $.flag_statement,
      $.say_statement,
      $.signal_statement,
      $.sound_statement
    ),

    branch_statement: $ => seq(
      'branch',
      '|',
      choice(
        $.end,
        seq('flag', '|', $.identifier),
        seq('no_flag', '|', $.identifier),
        seq('choice', repeat(seq('|', $.choice))),
        seq('evaluate', '|', $.expression)
      )
    ),

    call_statement: $ => seq(
      'call',
      '|',
      $.code
    ),

    choice_statement: $ => seq(
      'choice',
      repeat(seq('|', $.choice))
    ),

    exit_statement: $ => seq($.exit, '|'),

    flag_statement: $ => seq(
      'flag',
      '|',
      choice(
        seq('raise', '|', $.identifier),
        seq('set', '|', $.string, '|', $.identifier),
        seq('inc', '|', $.identifier),
        seq('inc', '|', $.number, '|', $.identifier),
        seq('dec', '|', $.identifier),
        seq('dec', '|', $.number, '|', $.identifier),
        seq('delete', '|', $.identifier)
      )
    ),

    say_statement: $ => seq(
      'say',

      optional(
        seq($.name, $.speech)
      ),

      // optional($.speech),
      optional(choice(
        seq('||', $.speech),
        seq(/\|\s*\|/, $.speech),
      )),
        // seq('|', $.speech),
      // )),
      repeat(seq('|', $.speech)),

      optional('|')
    ),

    signal_statement: $ => seq(
      'signal',
      repeat(seq(
        '|',
        choice(
          $.number,
          $.identifier,
          $.string,
        ))
      )
    ),

    sound_statement: $ => seq(
      'sound',
      '|',
      $.string,
      optional(seq('|', $.string)),
      optional(seq('|', $.number))
    ),

    // identifier: $ => /[a-zA-Z_]\w*/,
    identifier: $ => /[^|\s]+/,

    // number: $ => /\d+[\|\s]/,
    number: $ => /(\d+\.\d+)|(\d+)[\|\s]/,
    // value: $ => /\d+/,

    speech: $ => /[^|\n]+/,
    name: $ => /\|\s*[a-zA-Z0-9]+\s*\|/,

    choice: $ => /[^|\n]+/,
    // speech: $ => /.*[|\n]/,

    code: $ => /[^\n]+/,

    expression: $ => /[^|^\n]+/,
    string: $ => /[^|^\n]+/,

    comment: $ => token(seq('//', /.*/)),

    bbcode: $ => /\[.*\]/,
    // bbcode: $ => /\[.*?\]/,

    end: $ => choice('end'),

    exit: $ => choice('exit')
  }
});
